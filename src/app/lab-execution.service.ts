import { Injectable } from '@angular/core';
import { DbRefBuilder } from './firebase/db-ref-builder';
import { AuthService } from './auth';
import { Lab } from './models/lab';
import { Execution } from './models/execution';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class LabExecutionService {

  constructor(
    private db: DbRefBuilder,
    private authService: AuthService
  ) { }

  observeExecution(id: string): Observable<Execution> {
    return this.authService
              .requireAuthOnce()
              .switchMap(_ => this.db.executionRef(id).value())
              .map((snapshot: any) => snapshot.val());
  }

  observeExecutionsForLab(lab: Lab): Observable<Array<Observable<Execution>>> {
    return this.authService
      .requireAuthOnce()
      .switchMap(_ => this.db.labExecutionsRef(lab.id).childAdded())
      .map((snapshot: any) => this.observeExecution(snapshot.key))
      .scan((acc, val) => {
        acc.unshift(val);
        return acc;
      }, []);
  }
}
