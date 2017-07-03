import { DbRefBuilder } from '../../firebase/db-ref-builder';
import { Observable } from 'rxjs/Observable';
import { ExecutionMessage, MessageKind } from '../../models/execution';

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
               .concat(Observable.of(this.createSkipInfoMessage(maxIndex - (this.partitionSize * 2))))
               .concat(this.getTailMessages(executionId, maxIndex - this.partitionSize, this.partitionSize))
               .concat(this.getLiveMessages(executionId, maxIndex));

  }

  getTailMessage(executionId) {
    return this.db.executionMessageRef(executionId)
                  .orderByChild('index')
                  .limitToLast(1)
                  .childAdded()
                  .take(1)
                  .map(snapshot => snapshot.val());
  }

  getHeadMessages(executionId, partitionSize) {
    return this.db.executionMessageRef(executionId)
                               .orderByChild('index')
                               .startAt(0)
                               .limitToFirst(partitionSize)
                               .childAdded()
                               .take(partitionSize)
                               .map(snapshot => snapshot.val());
  }

  getTailMessages(executionId, startAt, partitionSize) {
    return this.db.executionMessageRef(executionId)
                  .orderByChild('index')
                  .startAt(startAt)
                  .limitToFirst(partitionSize)
                  .childAdded()
                  .take(partitionSize)
                  .map(snapshot => snapshot.val());
  }

  getLiveMessages(executionId, startAt) {
     return this.db.executionMessageRef(executionId)
                   .orderByChild('index')
                   .startAt(startAt)
                   .childAdded()
                   .map(snapshot => snapshot.val());
  }

  getAllMessages(executionId) {
    return this.db.executionMessageRef(executionId)
               .childAdded()
               .map(snapshot => snapshot.val());
  }

  createSkipInfoMessage(skippedMessages) {
    return {
      data: `
##################################################################################################
WOAH! LOOK AT ALL THIS EXCITING OUTPUT!

Unfortunately, the output is a little too large, so we had to skip ${skippedMessages} messages.
In the future you'll be able to download the entire log as a textfile.
##################################################################################################`,
      kind: MessageKind.Stdout
    };
  }
}
