import { Observable } from '@reactivex/rxjs';
import { Resolver } from './resolver';
import { dbRefBuilder } from '../../ml-firebase';
import { Invocation, InvocationExecution } from '@machinelabs/models';
import { MessageKind } from '../../models/execution';

export class ExecutionResolver implements Resolver {

  resolve(invocation: Invocation) {

    let invocationExecution: InvocationExecution = invocation.data;
    let executionId = invocationExecution.execution_id;

    return !executionId ?
              Observable.of(null) :
              dbRefBuilder.executionRef(executionId)
                     .onceValue()
                     .map(snapshot => snapshot.val());
  }
}
