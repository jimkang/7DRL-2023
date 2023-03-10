import { SoulDef } from '../../types';

export let tealTileDef: SoulDef = {
  tags: ['bg'],
  kind: 'tile',
  collisionMask: 0,
  collisionCategory: 0,
  collisionGroup: -1,
  svgSrcForDirections: {
    default: 'teal-tile.svg',
  },
  svgScale: 0.25,
  verticesScale: 0.25,
  rotation: 30,
  layer: 'bg',
  verticesBox: { x: 0, y: 0, width: 64, height: 64 },
  vertices: [
    {
      x: 0,
      y: 0,
    },
    {
      x: 0,
      y: 64,
    },
    {
      x: 64,
      y: 64,
    },
    {
      x: 64,
      y: 0,
    },
  ],
};
