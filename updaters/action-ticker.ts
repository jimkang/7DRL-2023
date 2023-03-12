import { QueueCmd, Soul } from '../types';
import groupBy from 'lodash.groupby';
import { compareQueueItems } from '../util/compare-queue-items';

export function ActionTicker({
  cmdLengthSeconds = 1,
}: {
  cmdLengthSeconds: number;
}) {
  // Indexes correspond to initiative scores. (This limits initiatives to
  // positive whole numbers. It also means you have to have an array with 400
  // elements, even if it just contains something at 0 and 400.)
  // Values are arrays of ActionCmds.
  // var cmdQueue: ActionCmd[][];
  var cmdQueue: QueueCmd[] = [];

  return {
    addCommand,
    runCommands,
  };

  function addCommand(queueCmd: QueueCmd) {
    cmdQueue.push(queueCmd);
  }

  async function runCommands({ existingSouls }: { existingSouls: Soul[] }) {
    try {
      var cmdGroups: Record<number, QueueCmd[]> = groupBy(
        cmdQueue.sort(compareQueueItems),
        (qc) => qc.initiative
      );
      for (let initKey in cmdGroups) {
        let group = cmdGroups[initKey];
        console.log('At initiative', initKey, 'running queueCmds', group);
        // TODO: this await makes it so that every action has take the same length of time.
        await Promise.allSettled(
          [stall(cmdLengthSeconds)].concat(
            group.map((queueCmd) =>
              queueCmd.cmd.fn(
                Object.assign(
                  {
                    name: 'todo',
                    id: 'todo',
                    existingSouls,
                    actors: queueCmd.cmd.actors,
                  },
                  { also: queueCmd.cmd.also }
                )
              )
            )
          )
        );
      }
    } catch (error) {
      console.error('Error while running commands.', error);
      // TODO: Recovery?
      throw error;
    } finally {
      cmdQueue.length = 0;
    }
  }
}

function stall(seconds: number): Promise<void> {
  return new Promise(function executor(resolve) {
    setTimeout(resolve, seconds * 1000);
  });
}
