import { db, dbRefBuilder } from '../ml-firebase/db';
import { Observable } from '@reactivex/rxjs';

export class MessageRepository {
  getMessages(executionId: string, fromVirtualIndex: number, toVirtualIndex: number) {
    return dbRefBuilder
            .executionMessagesRef(executionId)
            .orderByChild('virtual_index')
            .startAt(fromVirtualIndex)
            .endAt(toVirtualIndex)
            .onceValue();
  }

  bulkUpdate(cmd: any) {
    return dbRefBuilder.rootRef()
                       .update(cmd);
  }
}

