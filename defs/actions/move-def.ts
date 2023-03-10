import { Action, ActionParams, Soul, Pt } from '../../types';
import { Body } from 'matter-js';

export function CreateMove({ seed }) {
  return createMove;

  function createMove({
    actors,
    direction,
  }: {
    actors: Soul[];
    direction: Pt;
  }): Action {
    return {
      name: 'move',
      id: 'todo',
      cmd: {
        curriedParams: {
          actors,
          name: 'move',
          id: 'todo',
          also: { direction },
        },
        fn: runMove,
      },
    };
  }
}

async function runMove({
  name,
  id,
  actors,
  also,
}: ActionParams): Promise<void> {
  console.log('Moving to', also.dest);
  actors.forEach((actor) => Body.setVelocity(actor.body, also.direction));
}
