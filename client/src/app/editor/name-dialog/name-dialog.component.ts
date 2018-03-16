import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { File, Directory, instanceOfFile, instanceOfDirectory } from '@machinelabs/models';

export interface NameDialogData {
  fileOrDirectory: File | Directory;
  parentDirectory: Directory;
  type: NameDialogType;
}

export enum NameDialogType {
  AddFile,
  AddDirectory,
  EditFile,
  EditDirectory
}

const isNameAllowed = (fileOrDirectory: File | Directory, parentDirectory: Directory) => {
  return (c: FormControl) => {
    const foundFileOrDirectory = parentDirectory.contents.find(f => f.name === c.value);

    return !foundFileOrDirectory ? null : { alreadyExists: true };
  };
};

@Component({
  selector: 'ml-name-dialog',
  templateUrl: './name-dialog.component.html',
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
export class NameDialogComponent implements OnInit {
  form: FormGroup;

  NameDialogType = NameDialogType;

  constructor(
    public dialogRef: MatDialogRef<NameDialogComponent>,
    private formBuilder: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: NameDialogData
  ) {}

  ngOnInit() {
    this.form = this.formBuilder.group({
      filename: [
        this.data.fileOrDirectory ? this.data.fileOrDirectory.name : '',
        [Validators.required, isNameAllowed(this.data.fileOrDirectory, this.data.parentDirectory)]
      ]
    });
  }

  submit(form) {
    this.dialogRef.close(`${form.value.filename}`);
  }
}
