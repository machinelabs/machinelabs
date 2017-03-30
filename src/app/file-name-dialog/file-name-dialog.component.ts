import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MdDialogRef, MD_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'ml-file-name-dialog',
  template: `
    <form [formGroup]="form" (ngSubmit)="submit(form)">
    <md-input-container>
        <input mdInput placeholder="File name" formControlName="filename">
        <md-hint *ngIf="!form.valid && !form.pristine" align="start">This field is required.</md-hint>
      </md-input-container>
      <div style="margin-top: 1em; text-align: center;">
        <button md-raised-button [disabled]="!form.valid" type="submit">Ok</button>
        <button md-raised-button type="button" (click)="dialogRef.close()">Cancel</button>
      </div>
    </form>
  `
})
export class FileNameDialogComponent implements OnInit {

  filename: string;

  form: FormGroup;

  constructor(
    private dialogRef: MdDialogRef<FileNameDialogComponent>,
    private formBuilder: FormBuilder,
    @Inject(MD_DIALOG_DATA) private data: any
  ) { }

  ngOnInit() {
    this.form = this.formBuilder.group({
      filename: [this.data.fileName || '', Validators.required]
    });
  }

  submit(form) {
    this.dialogRef.close(`${form.value.filename}`);
  }
}
