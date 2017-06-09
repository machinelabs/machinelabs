import { Injectable } from '@angular/core';
import { MdSnackBar } from '@angular/material';

@Injectable()
export class EditorSnackbarService {

  constructor(private snackBar: MdSnackBar) {}

  notify(text: string, config = { actionLabel: 'Dismiss', duration: 3000 }) {
    return this.snackBar.open(text, config.actionLabel, { duration: config.duration });
  }

  notifyInvalidConfig() {
    this.notify('Execution Rejected. Please check your ml.yaml');
  }

  notifyLabCreated() {
    this.notify('New lab created');
  }

  notifyLabUpdated() {
    this.notify('Lab updated');
  }

  notifyLabForked() {
    this.notify('Lab forked');
  }

  notifyLabStopped() {
    this.notify('Lab stopped');
  }

  notifyExecutionFinished() {
    this.notify('Execution finished');
  }

  notifyLateExecution() {
    return this.notify('The server doesn\'t seem responding');
  }
}
