import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { MdDialogRef, MD_DIALOG_DATA } from '@angular/material';
import { File, Directory, instanceOfFile, instanceOfDirectory } from '@machinelabs/core/models/directory';

export interface NameDialogData {
  fileOrDirectory: File|Directory,
  parentDirectory: Directory,
  type: NameDialogType
}

export enum NameDialogType {
  AddFile,
  AddDirectory,
  EditFile,
  EditDirectory
}

const isNameAllowed = (fileOrDirectory: File|Directory, parentDirectory: Directory) => {
  return (c: FormControl) => {

    const foundFileOrDirectory = parentDirectory.contents.find(f => f.name === c.value);

    if (!foundFileOrDirectory) {
      return null;
    }

    let error = null;

    if (instanceOfFile(fileOrDirectory) && instanceOfFile(foundFileOrDirectory)) {
      error = { alreadyExists: true };
    } else if (instanceOfDirectory(fileOrDirectory) && instanceOfDirectory(foundFileOrDirectory)) {
      error = { alreadyExists: true};
    }
    return error || null;
  };
};

@Component({
  selector: 'ml-name-dialog',
  templateUrl: './name-dialog.component.html',
  styles: [`
    :host {
      display: block;
      width: 500px;
    }
    md-form-field {
      width: 100%;
    }
    md-hint {
      width: 100%;
      text-align: right;
    }
  `]
})
export class NameDialogComponent implements OnInit {

  form: FormGroup;

  NameDialogType = NameDialogType;

  constructor(
    public dialogRef: MdDialogRef<NameDialogComponent>,
    private formBuilder: FormBuilder,
    @Inject(MD_DIALOG_DATA) public data: NameDialogData
  ) { }

  ngOnInit() {
    this.form = this.formBuilder.group({
      filename: [
        this.data.fileOrDirectory ? this.data.fileOrDirectory.name : '', [
        Validators.required,
        isNameAllowed(
          this.data.fileOrDirectory,
          this.data.parentDirectory
        )
      ]]
    });
  }

  submit(form) {
    this.dialogRef.close(`${form.value.filename}`);
  }
}
