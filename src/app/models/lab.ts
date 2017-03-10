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
  readonly id: string;
  readonly lab: Lab;
  status: ExecutionStatus;

  constructor (lab?:Lab) {
    this.status = ExecutionStatus.Pristine;
    this.id = `${Date.now()}`;
    this.lab = lab;
  }

  isRunning () {
    return this.status === ExecutionStatus.Running;
  }
}
