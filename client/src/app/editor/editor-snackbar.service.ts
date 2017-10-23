import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material';

import { Observable } from 'rxjs/Observable';
import { timer } from 'rxjs/observable/timer';
import { takeUntil } from 'rxjs/operators';

@Injectable()
export class EditorSnackbarService {

  constructor(private snackBar: MatSnackBar) {}

  notify(text: string, config = { actionLabel: 'Dismiss', duration: 3000 }) {
    return this.snackBar.open(text, config.actionLabel, { duration: config.duration });
  }

  notifyInvalidConfig(msg = 'Please check your ml.yaml') {
    this.notify(`Execution Rejected. ${msg}`);
  }

  notifyLabCreated() {
    this.notify('New lab created');
  }

  notifyLabDeleted() {
    this.notify('Lab deleted');
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

  notifyExecutionStartedPauseMode() {
    return this.notify('Execution started', {
      actionLabel:  'Unpause to see output',
      duration: 5000
    });
  }

  notifyExecutionFinishedPauseMode() {
    return this.notify('Execution finished', { actionLabel: 'Show output', duration: 0 });
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

  notifyExecutionFailed() {
    return this.notify('Execution failed, please try again');
  }

  notifyServerNotAvailable() {
    return this.notify('The server doesn\'t seem to be available, please try again');
  }

  notifyExecutionRateLimitExceeded() {
    return this.notify('Execution rate limit exceeded, slow down a little.');
  }

  notifyError() {
    this.notify('Request failed, please try again');
  }

  notifyActionUndone() {
    this.notify('Undone');
  }

  notifyUnless<T>(notifier$: Observable<T>, message: string, waitMs = 10000) {
    timer(waitMs).pipe(takeUntil(notifier$)).subscribe(_ => this.notify(message));
  }

  notifyLateExecutionUnless<T>(notifier$: Observable<T>, waitMs?) {
    this.notifyUnless(notifier$, 'The server doesn\'t seem responding', waitMs);
  }
}
