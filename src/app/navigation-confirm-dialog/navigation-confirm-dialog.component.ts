import { Component, OnInit } from '@angular/core';
import { MdDialogRef } from '@angular/material';

@Component({
  selector: 'ml-navigation-confirm-dialog',
  template: `
    <p>Are you sure? Unsaved changes will be gone.</p>
    <div style="margin-top: 1em; text-align: center;">
      <button md-raised-button (click)="dialogRef.close(true)">Yes</button>
      <button md-raised-button type="button" (click)="dialogRef.close()">Close</button>
    </div>
  `
})
export class NavigationConfirmDialogComponent {

  constructor(private dialogRef: MdDialogRef<NavigationConfirmDialogComponent>) { }
}
