import { SoulDefMap } from '../../types';
import { squirrelDef } from '../squirrel-def';
import { range } from 'd3-array';

export var exampleGuysMap: SoulDefMap = range(10)
  .map((i) =>
    range(10).map((j) => ({
      def: squirrelDef,
      pos: {
        x: 0, //(i + 0.5) * squirrelDef.verticesBox.width,
        y: 0, //(j + 0.5) * squirrelDef.verticesBox.height,
      },
    }))
  )
  .flat();
