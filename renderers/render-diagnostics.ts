import accessor from 'accessor';

import { select } from 'd3-selection';

var diagnosticsRoot = select('#diagnostics-root');
var getBody = accessor('body');

export function renderPhysicsDiagnostics({ souls }) {
  var bodies = souls.map(getBody);
  renderBounds({ bodies });
  renderBodyCenters({ bodies });
}

function renderBounds({ bodies }) {
  var edges = bodies
    .map((body) => verticesToEdges(body.id, body.vertices))
    .flat();
  //console.log(
  //'body ids for edges',
  //edges.map((edge) => edge.bodyId)
  //);
  var lines = diagnosticsRoot.selectAll('line').data(edges, (edge) => edge.id);
  lines.exit().remove();
  lines
    .enter()
    .append('line')
    .attr('stroke', getBodyColor)
    .merge(lines)
    .attr('x1', (edge) => edge.x1)
    .attr('y1', (edge) => edge.y1)
    .attr('x2', (edge) => edge.x2)
    .attr('y2', (edge) => edge.y2);
}

function renderBodyCenters({ bodies }) {
  var dots = diagnosticsRoot.selectAll('circle').data(bodies, accessor());
  dots.exit().remove();
  dots
    .enter()
    .append('circle')
    .attr('r', 4)
    .attr('fill', getBodyColor)
    .merge(dots)
    .attr('cx', (body) => body.position.x)
    .attr('cy', (body) => body.position.y);
}

function verticesToEdges(bodyId, vertices) {
  var edges = [];
  for (let i = 0; i < vertices.length - 1; ++i) {
    edges.push(vertexPairToEdge(bodyId, vertices[i], vertices[i + 1]));
  }
  if (edges.length > 2) {
    let lastEdge = edges[edges.length - 1];
    let firstEdge = edges[0];
    edges.push({
      x1: lastEdge.x2,
      y1: lastEdge.y2,
      x2: firstEdge.x1,
      y2: firstEdge.y1,
      id: [lastEdge.x2, lastEdge.y2, firstEdge.x1, firstEdge.y1].join('_'),
      bodyId,
    });
    return edges;
  }
}

function vertexPairToEdge(bodyId, v1, v2) {
  return {
    x1: v1.x,
    y1: v1.y,
    x2: v2.x,
    y2: v2.y,
    id: [v1.x, v1.y, v2.x, v2.y].join('_'),
    bodyId,
  };
}

function getBodyColor(obj) {
  return `hsl(${((obj.bodyId || obj.id) * 47) % 360}, 80%, 50%)`;
}
