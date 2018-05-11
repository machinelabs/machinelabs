import { DbRefBuilder } from '../../firebase/db-ref-builder';

import { of } from 'rxjs';
import { switchMap, concat, take, map } from 'rxjs/operators';

import { ExecutionMessage } from '../../models/execution';
import { createSkipText } from '../util/skip-helper';
import { snapshotToValue } from '../../rx/snapshotToValue';
import { MessageKind } from '@machinelabs/models';

export class MessageStreamOptimizer {
  constructor(private db: DbRefBuilder, private partitionSize, private fullFetchTreshold) {}

  listenForMessages(executionId) {
    return this.getTailMessage(executionId).pipe(
      switchMap(
        (message: ExecutionMessage) =>
          message.index >= this.fullFetchTreshold
            ? this.getHeadTailAndLiveMessages(executionId, message.index)
            : this.getAllMessages(executionId)
      )
    );
  }

  getHeadTailAndLiveMessages(executionId, maxIndex) {
    return this.getHeadMessages(executionId, this.partitionSize).pipe(
      concat(
        of({
          data: createSkipText(maxIndex - this.partitionSize * 2),
          kind: MessageKind.Stdout
        })
      ),
      concat(this.getTailMessages(executionId, maxIndex - this.partitionSize, this.partitionSize)),
      concat(this.getLiveMessages(executionId, maxIndex))
    );
  }

  getTailMessage(executionId) {
    return this.db
      .executionMessageRef(executionId)
      .orderByChild('index')
      .limitToLast(1)
      .childAdded()
      .pipe(take(1), snapshotToValue);
  }

  getHeadMessages(executionId, partitionSize) {
    return this.db
      .executionMessageRef(executionId)
      .orderByChild('index')
      .startAt(0)
      .limitToFirst(partitionSize)
      .childAdded()
      .pipe(take(partitionSize), snapshotToValue);
  }

  getTailMessages(executionId, startAt, partitionSize) {
    return this.db
      .executionMessageRef(executionId)
      .orderByChild('index')
      .startAt(startAt)
      .limitToFirst(partitionSize)
      .childAdded()
      .pipe(take(partitionSize), snapshotToValue);
  }

  getLiveMessages(executionId, startAt) {
    return this.db
      .executionMessageRef(executionId)
      .orderByChild('index')
      .startAt(startAt)
      .childAdded()
      .pipe(snapshotToValue);
  }

  getAllMessages(executionId) {
    return this.db
      .executionMessageRef(executionId)
      .childAdded()
      .pipe(snapshotToValue);
  }
}
