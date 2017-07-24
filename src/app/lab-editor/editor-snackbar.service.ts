import { Injectable } from '@angular/core';
import { MdSnackBar } from '@angular/material';
import { Observable } from 'rxjs/Observable';

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

  notifyLabRestored() {
    this.notify('Lab restored');
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

  notifyExecutionRemoved() {
    return this.notify('Execution removed', { actionLabel: 'Undo', duration: 5000 });
  }

  notifyExecutionUpdated() {
    return this.notify('Execution updated');
  }

  notifyError() {
    this.notify('Request failed, please try again');
  }

  notifyActionUndone() {
    this.notify('Undone');
  }

  notifyUnless(notifier$, message: string, waitMs = 5000) {
    Observable.timer(waitMs)
              .takeUntil(notifier$)
              .subscribe(_ => this.notify(message));
  }

  notifyLateExecutionUnless(notifier$, waitMs = 5000) {
    this.notifyUnless(notifier$, 'The server doesn\'t seem responding', waitMs);
  }
}
