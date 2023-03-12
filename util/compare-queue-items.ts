import { QueueItem } from '../types';

export function compareQueueItems(a: QueueItem, b: QueueItem) {
  return a.initiative < b.initiative ? -1 : 1;
}
