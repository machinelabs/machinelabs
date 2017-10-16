import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

export enum NavigationConfirmReason {
  UnsavedChanges,
  RunningExecutions
}

@Component({
  selector: 'ml-navigation-confirm-dialog',
  template: `
    <ml-dialog-header>Are you sure?</ml-dialog-header>
    <ml-dialog-content>
      <ng-container [ngSwitch]="data.reason">
        <p *ngSwitchCase="NavigationConfirmReason.UnsavedChanges">
          Unsaved changes will be gone.
        </p>
        <p *ngSwitchCase="NavigationConfirmReason.RunningExecutions">
          You have running executions, but you can always come back to check them out.
        </p>
      </ng-container>
    </ml-dialog-content>
    <ml-dialog-cta-bar>
      <button mat-button (click)="dialogRef.close(true)">Yes</button>
      <button mat-button type="button" (click)="dialogRef.close()">Close</button>
    </ml-dialog-cta-bar>
  `,
  styles: [`
    :host {
      display: block;
      width: 500px;
    }

    p { text-align: center; }
  `]
})
export class NavigationConfirmDialogComponent {

  NavigationConfirmReason = NavigationConfirmReason;

  constructor(
    public dialogRef: MatDialogRef<NavigationConfirmDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }
}
