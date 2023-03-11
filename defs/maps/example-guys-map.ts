import { SoulDefMap } from '../../types';
import { squirrelDef } from '../souls/squirrel-def';
import { range } from 'd3-array';
import { robedOneDef } from '../souls/robed-one-def';

export var exampleGuysMap: SoulDefMap = range(3)
  .map((i) =>
    range(4).map((j) => ({
      def: squirrelDef,
      pos: {
        x:
          (i + 0.5) * squirrelDef.verticesBox.width * squirrelDef.verticesScale,
        y:
          (j + 0.5) *
          squirrelDef.verticesBox.height *
          squirrelDef.verticesScale,
      },
    }))
  )
  .flat();

exampleGuysMap.push({
  def: robedOneDef,
  pos: {
    x: 16,
    y: 16
  }
});
