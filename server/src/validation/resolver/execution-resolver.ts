import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { Resolver } from './resolver';
import { dbRefBuilder } from '../../ml-firebase';
import { Invocation, InvocationExecution } from '@machinelabs/models';

export class ExecutionResolver implements Resolver {
  resolve(invocation: Invocation) {
    const invocationExecution: InvocationExecution = invocation.data;
    const executionId = invocationExecution.execution_id;

    return !executionId
      ? of(null)
      : dbRefBuilder
          .executionRef(executionId)
          .onceValue()
          .pipe(map(snapshot => snapshot.val()));
  }
}
