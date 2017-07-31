import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MdDialogRef, MD_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'ml-edit-execution-dialog',
  template: `
    <ml-dialog-header>Edit Execution</ml-dialog-header>
    <form [formGroup]="form" (ngSubmit)="submit(form)">
      <ml-dialog-content>
        <md-input-container>
          <input mdInput placeholder="Name" formControlName="name">
          <md-hint *ngIf="!form.valid && !form.pristine">This field is required.</md-hint>
        </md-input-container>
      </ml-dialog-content>
      <ml-dialog-cta-bar>
        <button md-button [disabled]="!form.valid" type="submit">Ok</button>
        <button md-button type="button" (click)="dialogRef.close()">Cancel</button>
      </ml-dialog-cta-bar>
    </form>
  `,
  styles: [`
    :host {
      display: block;
      width: 500px;
    }
    md-input-container {
      width: 100%;
    }
    md-hint {
      width: 100%;
      text-align: right;
    }
  `]
})
export class EditExecutionDialogComponent implements OnInit {

  name: string;

  form: FormGroup;

  constructor(
    public dialogRef: MdDialogRef<EditExecutionDialogComponent>,
    private formBuilder: FormBuilder,
    @Inject(MD_DIALOG_DATA) private data: any
  ) { }

  ngOnInit() {
    this.form = this.formBuilder.group({
      name: [this.data.execution.name || '']
    });
  }

  submit(form) {
    this.dialogRef.close(`${form.value.name}`);
  }
}
