import { SpecialUser, InvocationType, HardwareType } from '@machinelabs/models';
import { ObservableDbRef, DbRefBuilder, uniqueId } from '@machinelabs/core';
import { Observable } from '@reactivex/rxjs';
import * as firebase from 'firebase';

export class TakedownService {
  constructor(private dbRefBuilder: DbRefBuilder) { }

  takedown(executionId: string) {

    let id = uniqueId();
    return this.dbRefBuilder
      .invocationRef(id)
      .set({
        id: id,
        type: InvocationType.StopExecution,
        data: { execution_id: executionId },
        user_id: SpecialUser.System,
        timestamp: firebase.database.ServerValue.TIMESTAMP
      })
      .map(_ => executionId);
  }

  takedownByUser(userId: string, hardwareTypes = [HardwareType.CPU, HardwareType.GPU]) {
    let executionIds$ = this.dbRefBuilder
      .userExecutionsLiveRef(userId)
      .onceValue()
      .map(snapshot => snapshot.val())
      .flatMap(val => Object.keys(val));

    if (hardwareTypes.length === Object.keys(HardwareType).length) {
      // no need to fetch executions if we don't have to check the hardware type
      return executionIds$.do(id => this.takedown(id));
    } else {
      return executionIds$
        .flatMap(id => this.dbRefBuilder.executionRef(id).onceValue())
        .map(snapshot => snapshot.val())
        .filter(val => !!val)
        .filter(execution => !!hardwareTypes.find(val => execution.hardware_type))
        .map(execution => execution.id)
        .do(id => this.takedown(id));
    }
  }
}
