export enum ExecutionStatus {
  Pristine,
  Running,
  Done,
  Stopped,
  Error
}

export interface File {
  name: string;
  content: string;
}

export interface LabTemplate {
  name: string;
  description: string;
  tags: string[];
  files: File[];
}

export interface Lab extends LabTemplate {
  id: string;
  user_id: string;
}

export class LabExecutionContext {
  private _id: string;
  private _lab: Lab;
  status: ExecutionStatus;

  constructor (lab: Lab = null, id = '') {
    this._id = id;
    this._lab = lab;
    this.status = ExecutionStatus.Pristine;
  }

  get id () {
    return this._id;
  }

  get lab () {
    return this._lab;
  }

  clone () {
    let context = new LabExecutionContext(this.lab, this.id);
    context.status = this.status;
    return context;
  }

  setData(lab: Lab, id: string) {
    if (!lab || !id) {
      throw new Error('Providing lab and id is mandatory');
    }

    this._lab = lab;
    this._id = id;
  }

  isRunning () {
    return this.status === ExecutionStatus.Running;
  }
}
