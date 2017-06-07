import { Observable } from '@reactivex/rxjs'
import { Resolver } from "validation/resolver/resolver";
import { DbRefBuilder } from '../../ml-firebase';
import { Invocation } from '../../models/invocation';
import { MessageKind } from '../../models/execution';

export class ExecutionResolver implements Resolver {

  db = new DbRefBuilder();

  resolve(invocation: Invocation) {
    // TODO: What if we can't find the execution. Will we be in limbo forever?
    return this.db.executionRef(invocation.id)
            .onceValue()
            .map(snapshot => snapshot.val())
            .switchMap(execution => {
              if (!execution) {
                return this.db.executionMessagesRef(invocation.id, 1)
                      .childAdded()
                      .take(1)
                      .map(snapshot => snapshot.val())
                      .filter(msg => msg.kind === MessageKind.OutputRedirected)
                      .switchMap(msg => {
                        return this.db.executionRef(msg.data)
                                      .onceValue()
                                      .map(snapshot => snapshot.val());
                      });
              }
              
              return Observable.of(execution);
            });
  }
}