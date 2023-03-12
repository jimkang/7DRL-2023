import { Action, Soul, SoulDef } from '../../types';
import { createMove } from '../actions/move-def';

export let robedOneDef: SoulDef = {
  tags: ['guy'],
  kind: 'robed-one',
  pickActions({ self, addCommand }: { self: Soul; addCommand }) {
    var moveRobeGuy: Action = createMove({
      actors: [self],
      direction: { x: 1, y: 1 },
    });
    addCommand({ cmd: moveRobeGuy.cmd, initiative: 1 });
  },
  collisionMask: -1,
  collisionCategory: 1,
  collisionGroup: 1,
  svgSrcForDirections: {
    default: 'robed-guy.svg',
  },
  svgScale: 1,
  verticesScale: 1,
  slop: 0.1,
  layer: 'guys',
  verticesBox: {
    'x': 2,
    'y': 0.58,
    'width': 57, 'height': 57
  },
  vertices: [
    {
      'x': 27,
      'y': 2.58
    },
    {
      'x': 15,
      'y': 6.58
    },
    {
      'x': 11,
      'y': 17.58
    },
    {
      'x': 4,
      'y': 22.58
    },
    {
      'x': 12,
      'y': 34.58
    },
    {
      'x': 14,
      'y': 42.58
    },
    {
      'x': 12,
      'y': 52.58
    },
    {
      'x': 19,
      'y': 53.58
    },
    {
      'x': 30,
      'y': 55.58
    },
    {
      'x': 34,
      'y': 48.58
    },
    {
      'x': 40,
      'y': 46.58
    },
    {
      'x': 49,
      'y': 37.58
    },
    {
      'x': 55,
      'y': 34.58
    },
    {
      'x': 57,
      'y': 22.58
    },
    {
      'x': 57,
      'y': 13.58
    },
    {
      'x': 50,
      'y': 13.58
    },
    {
      'x': 42,
      'y': 10.58
    },
    {
      'x': 38,
      'y': 4.58
    }
  ]
};