import { Component, OnInit } from '@angular/core';
import { MdDialogRef } from '@angular/material';

@Component({
  selector: 'ml-navigation-confirm-dialog',
  template: `
    <p>Are you sure? Unsaved changes will be gone.</p>
    <div class="cta-bar">
      <button md-button (click)="dialogRef.close(true)">Yes</button>
      <button md-button type="button" (click)="dialogRef.close()">Close</button>
    </div>
  `,
  styles: [`
    .cta-bar {
      text-align: center;
    }
  `]
})
export class NavigationConfirmDialogComponent {

  constructor(public dialogRef: MdDialogRef<NavigationConfirmDialogComponent>) { }
}
