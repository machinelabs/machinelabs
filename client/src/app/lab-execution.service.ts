import { Injectable } from '@angular/core';

import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import { forkJoin } from 'rxjs/observable/forkJoin';
import { map, scan, switchMap } from 'rxjs/operators';
import { snapshotToValue } from './rx/snapshotToValue';

import { DbRefBuilder } from './firebase/db-ref-builder';
import { AuthService } from './auth';
import { Lab } from './models/lab';
import { User } from './models/user';
import { Execution } from './models/execution';
import { parseLabDirectory } from '@machinelabs/core/dist/src/io/lab-fs/parse';
import { ExecutionStatus } from '@machinelabs/models';

const mapExecutionLabDirectory = (source: Observable<Execution>) =>
  source.pipe(map(execution => {
    if (execution && execution.lab) {
      execution.lab.directory = parseLabDirectory(execution.lab.directory);
    }
    return execution;
  }));

@Injectable()
export class LabExecutionService {

  constructor(
    private db: DbRefBuilder,
    private authService: AuthService
  ) { }

  observeExecution(id: string): Observable<Execution> {
    return this.authService.requireAuthOnce().pipe(
      switchMap(_ => this.db.executionRef(id).value()),
      snapshotToValue,
      mapExecutionLabDirectory
    );
  }

  observeExecutionsForLab(lab: Lab): Observable<Array<{id: string, execution: Observable<Execution>}>> {
    return this.authService.requireAuthOnce().pipe(
      switchMap(_ => this.db.labVisibleExecutionsRef(lab.id).childAdded()),
      map((snapshot: any) => ({ id: snapshot.key, execution: this.observeExecution(snapshot.key)})),
      scan((
        acc: Array<{id: string, execution: Observable<Execution> }>,
        val: {id: string, execution: Observable<Execution>}
      ) => [val, ...acc], []),
      map(val => [...val])
    );
  }

  observeExecutionsForUser(user: User): Observable<Array<Observable<Execution>>> {
    return this.authService.requireAuthOnce().pipe(
      switchMap(_ => this.db.userVisibleExecutionsRef(user.id).childAdded()),
      map((snapshot: any) => this.observeExecution(snapshot.key)),
      scan((acc: Array<Observable<Execution>>, val: Observable<Execution>) => {
        acc.unshift(val);
        return acc;
      }, [])
    );
  }

  getLatestExecutionIdForLab(id: string) {
    return this.authService.requireAuthOnce().pipe(
      switchMap(_ => this.db.labExecutionsRef(id).limitToLast(1).onceValue()),
      snapshotToValue,
      map(value => value ? Object.keys(value)[0] : null)
    );
  }

  getExecution(id: string) {
    return this.authService.requireAuthOnce().pipe(
      switchMap(_ => this.db.executionRef(id).onceValue()),
      snapshotToValue,
      mapExecutionLabDirectory
    );
  }

  getLatestVisibleExecutionIdForLab(id: string) {
    return this.authService.requireAuthOnce().pipe(
      switchMap(_ => this.db.labVisibleExecutionsRef(id).limitToLast(1).onceValue()),
      snapshotToValue,
      map(value => value ? Object.keys(value)[0] : null)
    );
  }

  executionExists(id: string) {
    return this.authService.requireAuth().pipe(
      switchMap(_ => this.db.executionRef(id).onceValue()),
      map((snapshot: any) => !!snapshot.val())
    );
  }

  executionExistsAndVisible(id: string) {
    return this.authService.requireAuth().pipe(
      switchMap(_ => this.db.executionRef(id).onceValue()),
      snapshotToValue,
      map(execution => !execution.hidden)
    );
  }

  getExecutionsFromLab(id: string) {
    return this.authService.requireAuthOnce().pipe(
      switchMap(_ => this.db.labVisibleExecutionsRef(id).onceValue()),
      snapshotToValue,
      map(executionIds => Object.keys(executionIds || {})),
      map(executionIds => executionIds.map(executionId => this.getExecution(executionId))),
      switchMap(executionRefs => executionRefs.length ? forkJoin(executionRefs) : of([])),
      // for safety
      map(executions => executions.filter(execution => execution))
    );
  }

  updateExecution(execution: Execution) {
    return this.authService.requireAuthOnce().pipe(
      switchMap(_ => this.db.executionRef(execution.id).update({
        hidden: execution.hidden || false,
        name: execution.name || ''
      }))
    );
  }

  labHasRunningExecutions(id: string) {
    return this.getExecutionsFromLab(id).pipe(
      map(executions => executions.filter(execution => execution.status === ExecutionStatus.Executing)),
      map(executions => !!executions.length)
    );
  }
}
