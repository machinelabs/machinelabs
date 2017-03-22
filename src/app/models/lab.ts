import { User } from './user';
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

export class Lab implements LabTemplate {

  private _lab;

  get id() {
    return this._lab.id;
  }

  set id(id) {
    this._lab.id = id;
  }

  get user_id() {
    return this._lab.user_id;
  }

  set user_id(id) {
    this._lab.user_id = id;
  }

  get name() {
    return this._lab.name;
  }

  set name(name: string) {
    this._lab.name = name;
  }

  get description() {
    return this._lab.description;
  }

  set description(description: string) {
    this._lab.description = description;
  }

  get tags() {
    return this._lab.tags;
  }

  set tags(tags: string[]) {
    this._lab.tags = tags;
  }

  get files() {
    return this._lab.files;
  }

  set files(files: File[]) {
    this._lab.files = files;
  }

  constructor(lab) {
    this._lab = lab;
  }

  isOwnedBy(user: User) {
    return this._lab.user_id === user.uid;
  }

  toJSON() {
    return this._lab;
  }
}

export class LabExecutionContext {
  private _id: string;
  private _lab: Lab;
  status: ExecutionStatus;

  constructor (lab: Lab = null, id: string = '') {
    this._id = id;
    this._lab = lab;
    this.status = ExecutionStatus.Pristine;
  }

  get id () {
    return this._id
  }

  get lab () {
    return this._lab
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
