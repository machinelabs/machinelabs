import { Component } from '@angular/core';

@Component({
  selector: 'ml-no-execution-dialog',
  template: `
    <ml-dialog-header>Nothing to see here!</ml-dialog-header>
    <ml-dialog-content>
      <p><strong>Whoops!</strong> Looks like this lab doesn't seem to have a valid execution, or it has been removed.</p>
    </ml-dialog-content>
  `,
  styles: [
    `
    p {
      text-align: center;
    }
  `
  ]
})
export class NoExecutionDialogComponent {}
