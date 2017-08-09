import { Observable } from '@reactivex/rxjs'
import { Resolver } from './resolver';
import { DbRefBuilder } from '../../ml-firebase';
import { Invocation, InvocationExecution } from '../../models/invocation';
import { MessageKind } from '../../models/execution';

export class ExecutionResolver implements Resolver {

  db = new DbRefBuilder();

  resolve(invocation: Invocation) {

    let invocationExecution: InvocationExecution = invocation.data;
    let executionId = invocationExecution.execution_id;

    return !executionId ? 
              Observable.of(null) :
              this.db.executionRef(executionId)
                     .onceValue()
                     .map(snapshot => snapshot.val());
  }
}
