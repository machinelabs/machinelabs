import { Injectable } from '@angular/core';
import { MdSnackBar } from '@angular/material';

@Injectable()
export class EditorSnackbarService {

  constructor(private snackBar: MdSnackBar) {}

  notify(text: string) {
    this.snackBar.open(text, 'Dismiss', { duration: 3000 });
  }

  notifyLabCreated() {
    this.notify('New lab created');
  }

  notifyLabStopped() {
    this.notify('Lab stopped');
  }

  notifyExecutionFinished() {
    this.notify('Execution finished');
  }

  notifyCacheReplay(data) {
    this.notify(`Replaying cached execution: ${data}`);
  }
}
