import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'ml-edit-execution-dialog',
  template: `
    <ml-dialog-header>Edit Execution</ml-dialog-header>
    <form [formGroup]="form" (ngSubmit)="submit(form)">
      <ml-dialog-content>
        <mat-form-field>
          <input matInput placeholder="Name" formControlName="name">
          <mat-hint *ngIf="!form.valid && !form.pristine">This field is required.</mat-hint>
        </mat-form-field>
      </ml-dialog-content>
      <ml-dialog-cta-bar>
        <button mat-button [disabled]="!form.valid" type="submit">Ok</button>
        <button mat-button type="button" (click)="dialogRef.close()">Cancel</button>
      </ml-dialog-cta-bar>
    </form>
  `,
  styles: [
    `
    :host {
      display: block;
      width: 500px;
    }
    mat-form-field {
      width: 100%;
    }
    mat-hint {
      width: 100%;
      text-align: right;
    }
  `
  ]
})
export class EditExecutionDialogComponent implements OnInit {
  name: string;

  form: FormGroup;

  constructor(
    public dialogRef: MatDialogRef<EditExecutionDialogComponent>,
    private formBuilder: FormBuilder,
    @Inject(MAT_DIALOG_DATA) private data: any
  ) {}

  ngOnInit() {
    this.form = this.formBuilder.group({
      name: [this.data.execution.name || '']
    });
  }

  submit(form) {
    this.dialogRef.close(`${form.value.name}`);
  }
}
