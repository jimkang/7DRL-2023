import accessor from 'accessor';

import { select } from 'd3-selection';
import { zoom as Zoom } from 'd3-zoom';

var board = select('#canvas');
var zoomLayer = board.select('#zoom-layer');
var zoom = Zoom().scaleExtent([0.125, 8]).on('zoom', zoomed);
board.call(zoom);

function zoomed(zoomEvent) {
  zoomLayer.attr('transform', zoomEvent.transform);
}

export function renderBones({ souls, depictionRootSelector }) {
  var depictionRoot = select(depictionRootSelector);
  //console.log(bodies.map((body) => body.vertices));
  //renderWalls({ bodies: bodies.filter((body) => body.label === 'wall') });

  var depictions = depictionRoot
    .selectAll('.depiction')
    .data(souls, accessor());
  depictions.exit().remove();
  var newDepictions = depictions
    .enter()
    .append('g')
    .attr('class', (soul) => `depiction ${soul.id}`);
  newDepictions.each(appendPaths);

  newDepictions.merge(depictions).attr('transform', getTransform);

  function getTransform(soul) {
    const scale = isNaN(soul.svgScale) ? 1.0 : soul.svgScale;
    const angleDegrees = (soul.body.angle / (2 * Math.PI)) * 360;
    // body.position is the center of the body.
    // Additionally, you can't assume that the vertices and
    // the svg share the same center.
    // Everything that goes into the translate command has to be pre-rotation.
    // Find the where the corner of the body would be if it weren't rotated,
    // making sure scale is accounted for.
    const bodyCornerX =
      soul.body.position.x - (soul.verticesBox.width / 2) * scale;
    const bodyCornerY =
      soul.body.position.y - (soul.verticesBox.height / 2) * scale;
    // Find where the representation's corner should be by using verticesOffset
    // and the body's corner, then compensating for the scaling: Move to the scaled corner.
    const translateString = `translate(${bodyCornerX - soul.verticesBox.x}, ${
      bodyCornerY - soul.verticesBox.y
    })`;
    const rotationString = `rotate(${angleDegrees}, ${soul.body.position.x}, ${soul.body.position.y})`;
    const scaleString = `scale(${scale})`;
    // The last command in the transform string goes first. Scale, then translate to the
    // destination, then rotate.
    return `${rotationString} ${translateString} ${scaleString}`;
  }

  function appendPaths(soul) {
    // cloneNode is necessary because appending it here will remove it from its
    // source tree.
    // TODO: Instead using default, check which direction the soul is facing and use the appropriate paths for that direction.
    soul.svgsForDirections.default.forEach((path) =>
      this.appendChild(path.cloneNode())
    );
  }
}
