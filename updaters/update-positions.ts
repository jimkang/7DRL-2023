import { Engine, Body, Composite } from 'matter-js';
import { SoulSpot } from '../types';

export function UpdatePositions({ fps = 60 }: { fps?: number }) {
  var engine = Engine.create({ gravity: { x: 0, y: 0, scale: 0 } });

  return { updatePositions, addSouls };

  function addSouls({ soulSpots }: { soulSpots: SoulSpot[] }) {
    var soulBodies = soulSpots.map(createBodyForSoul);
    Composite.add(engine.world, soulBodies);
  }

  function updatePositions() {
    Engine.update(engine, 1000 / fps);
    return Composite.allBodies(engine.world);
  }

  function createBodyForSoul(spot: SoulSpot) {
    var bodyOpts = {
      angle: spot.soul.rotation ? spot.soul.rotation : 0,
      label: spot.soul.id,
      restitution: 1.25,
      slop: spot.soul.slop || 16,
      density: 1,
      force: { x: 0, y: 0 },
    };

    if (spot.soul.vertices) {
      let scaledVertices = isNaN(spot.soul.verticesScale)
        ? spot.soul.vertices
        : spot.soul.vertices.map((vertex) => ({
          x: vertex.x * spot.soul.verticesScale,
          y: vertex.y * spot.soul.verticesScale,
        }));
      spot.soul.body = Body.create(
        Object.assign(
          {
            vertices: scaledVertices,
            position: {
              x: spot.pos.x - spot.soul.verticesBox.x / spot.soul.verticesScale,
              y: spot.pos.y - spot.soul.verticesBox.y / spot.soul.verticesScale,
            },
            collisionFilter: {
              group: spot.soul.collisionGroup,
              category: spot.soul.collisionCategory,
              mask: spot.soul.collisionMask,
            },
          },
          bodyOpts
        )
      );
      return spot.soul.body;
    }
    throw new Error('Missing vertices.');
  }
}
