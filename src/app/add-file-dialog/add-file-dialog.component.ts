import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MdDialogRef } from '@angular/material';

@Component({
  selector: 'ml-add-file-dialog',
  template: `
    <form [formGroup]="form" (ngSubmit)="submit(form)">
    <md-input-container>
        <span md-suffix>.py</span>
        <input mdInput placeholder="File name" formControlName="filename">
        <md-hint *ngIf="!form.valid && !form.pristine" align="start">This field is required.</md-hint>
      </md-input-container>
      <div style="margin-top: 1em; text-align: center;">
        <button md-raised-button [disabled]="!form.valid" type="submit">Add</button>
        <button md-raised-button type="button" (click)="dialogRef.close()">Close</button>
      </div>
    </form>
  `,
  styleUrls: ['./add-file-dialog.component.css']
})
export class AddFileDialogComponent implements OnInit {

  filename: string;

  form: FormGroup;

  constructor(private dialogRef: MdDialogRef<AddFileDialogComponent>, private formBuilder: FormBuilder) { }

  ngOnInit() {
    this.form = this.formBuilder.group({
      filename: ['', Validators.required]
    });
  }

  submit(form) {
    this.dialogRef.close(`${form.value.filename}.py`);
  }
}
