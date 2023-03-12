import { QueueCallback } from '../types';
import groupBy from 'lodash.groupby';
import { compareQueueItems } from '../util/compare-queue-items';

// A turn is when actions are selected, but not when they're executed.
export function TurnTicker({ addActionCommand }) {
  var callbackQueue: QueueCallback[] = [];

  return {
    registerTurnTaker,
    runTurn,
  };

  function registerTurnTaker(queueCb: QueueCallback) {
    callbackQueue.push(queueCb);
  }

  function runTurn() {
    try {
      var callbackGroups: Record<number, QueueCallback[]> = groupBy(
        callbackQueue.sort(compareQueueItems),
        (qc) => qc.initiative
      );
      for (let initKey in callbackGroups) {
        let group = callbackGroups[initKey];
        console.log('At initiative', initKey, 'running queuecallbacks', group);
        group.map((queueCallback) =>
          queueCallback.callback(
            Object.assign(
              { addCommand: addActionCommand },
              queueCallback.params || {}
            )
          )
        );
      }
    } catch (error) {
      console.error('Error while running turn.', error);
      // TODO: Recovery?
      throw error;
    } finally {
      callbackQueue.length = 0;
    }
  }
}
