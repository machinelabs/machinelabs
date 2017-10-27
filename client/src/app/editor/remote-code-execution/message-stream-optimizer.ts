import { DbRefBuilder } from '../../firebase/db-ref-builder';
import { Observable } from 'rxjs/Observable';
import { ExecutionMessage, MessageKind } from '../../models/execution';
import { createSkipText } from '../util/skip-helper'
import 'rxjs/add/operator/let';
import { snapshotToValue } from '../../rx/snapshotToValue';

export class MessageStreamOptimizer {
  constructor(private db: DbRefBuilder, private partitionSize, private fullFetchTreshold) {
  }

  listenForMessages(executionId) {
    return this.getTailMessage(executionId)
               .switchMap((message: ExecutionMessage) => message.index >= this.fullFetchTreshold ?
                  this.getHeadTailAndLiveMessages(executionId, message.index) : this.getAllMessages(executionId));
  }

  getHeadTailAndLiveMessages(executionId, maxIndex) {
    return this.getHeadMessages(executionId, this.partitionSize)
               .concat(Observable.of({
                 data: createSkipText(maxIndex - (this.partitionSize * 2)),
                 kind: MessageKind.Stdout
                }))
               .concat(this.getTailMessages(executionId, maxIndex - this.partitionSize, this.partitionSize))
               .concat(this.getLiveMessages(executionId, maxIndex));

  }

  getTailMessage(executionId) {
    return this.db.executionMessageRef(executionId)
                  .orderByChild('index')
                  .limitToLast(1)
                  .childAdded()
                  .take(1)
                  .let(snapshotToValue);
  }

  getHeadMessages(executionId, partitionSize) {
    return this.db.executionMessageRef(executionId)
                               .orderByChild('index')
                               .startAt(0)
                               .limitToFirst(partitionSize)
                               .childAdded()
                               .take(partitionSize)
                               .let(snapshotToValue);
  }

  getTailMessages(executionId, startAt, partitionSize) {
    return this.db.executionMessageRef(executionId)
                  .orderByChild('index')
                  .startAt(startAt)
                  .limitToFirst(partitionSize)
                  .childAdded()
                  .take(partitionSize)
                  .let(snapshotToValue);
  }

  getLiveMessages(executionId, startAt) {
     return this.db.executionMessageRef(executionId)
                   .orderByChild('index')
                   .startAt(startAt)
                   .childAdded()
                   .let(snapshotToValue);
  }

  getAllMessages(executionId) {
    return this.db.executionMessageRef(executionId)
               .childAdded()
               .let(snapshotToValue);
  }

}
