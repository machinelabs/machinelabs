import { Execution, ExecutionStatus, ClientExecutionState } from './execution';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';

export interface File {
  name: string;
  content: string;
}

export interface LabTemplate {
  name: string;
  description: string;
  tags: string[];
  directory: File[];
}

export interface Lab extends LabTemplate {
  id: string;
  user_id: string;
  has_cached_run: boolean;
}

export class LabExecutionContext {
  private _execution$: BehaviorSubject<Execution>;
  private _id: string;
  private _lab: Lab;
  clientExecutionState = ClientExecutionState.NotExecuting;
  _execution: Execution;
  execution$: Observable<Execution>;

  constructor (lab: Lab = null, id = '') {
    this.setData(lab, id);
  }

  set execution (val: Execution) {
    this._execution = val;
    this._execution$.next(val);
  }

  get execution () {
    return this._execution;
  }

  get id () {
    return this._id;
  }

  get lab () {
    return this._lab;
  }

  clone () {
    let context = new LabExecutionContext(this.lab, this.id);
    context.execution = this.execution;
    return context;
  }

  resetData(lab: Lab, id: string) {
    if (!lab || !id) {
      throw new Error('Providing lab and id is mandatory');
    }
    this.setData(lab, id);
  }

  private setData(lab: Lab, id: string) {
    this._lab = lab;
    this._id = id;
    this._execution = {
      status: ExecutionStatus.Pristine
    };

    this._execution$ = new BehaviorSubject<Execution>(this._execution);
    this.execution$ = this._execution$.asObservable();
  }

  isRunning () {
    return this.execution.status === ExecutionStatus.Executing;
  }
}
