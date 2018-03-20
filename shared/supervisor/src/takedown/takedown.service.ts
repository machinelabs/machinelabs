import * as firebase from 'firebase';
import { SYSTEM_USER, InvocationType, HardwareType } from '@machinelabs/models';
import { ObservableDbRef, DbRefBuilder, uniqueId } from '@machinelabs/core';
import { Observable } from 'rxjs/Observable';
import { map } from 'rxjs/operators/map';
import { mergeMap } from 'rxjs/operators/mergeMap';
import { filter } from 'rxjs/operators/filter';
import { tap } from 'rxjs/operators/tap';

export class TakedownService {
  constructor(private dbRefBuilder: DbRefBuilder) {}

  takedown(executionId: string) {
    const id = uniqueId();
    return this.dbRefBuilder
      .invocationRef(id)
      .set({
        id: id,
        type: InvocationType.StopExecution,
        data: { execution_id: executionId },
        user_id: SYSTEM_USER,
        timestamp: firebase.database.ServerValue.TIMESTAMP
      })
      .pipe(map(_ => executionId));
  }

  takedownByUser(userId: string, hardwareTypes = [HardwareType.CPU, HardwareType.GPU]) {
    const executionIds$ = this.dbRefBuilder
      .userExecutionsLiveRef(userId)
      .onceValue()
      .pipe(map(snapshot => snapshot.val()), mergeMap(val => Object.keys(val)));

    if (hardwareTypes.length === Object.keys(HardwareType).length) {
      // no need to fetch executions if we don't have to check the hardware type
      return executionIds$.pipe(tap(id => this.takedown(id)));
    } else {
      return executionIds$.pipe(
        mergeMap(id => this.dbRefBuilder.executionRef(id).onceValue()),
        map(snapshot => snapshot.val()),
        filter(val => !!val),
        filter(execution => !!hardwareTypes.find(val => execution.hardware_type)),
        map(execution => execution.id),
        tap(id => this.takedown(id))
      );
    }
  }
}
