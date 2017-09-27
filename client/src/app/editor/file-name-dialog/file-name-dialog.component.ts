import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { MdDialogRef, MD_DIALOG_DATA } from '@angular/material';
import { File, Directory, instanceOfFile, instanceOfDirectory } from '@machinelabs/core/models/directory';

export interface NameDialogData {
  fileOrDirectory: File|Directory,
  parentDirectory: Directory
}

const isNameAllowed = (fileOrDirectory: File|Directory, parentDirectory: Directory) => {
  return (c: FormControl) => {

    const f = parentDirectory.contents.find(_f => _f.name === c.value);

    if (!f) {
      return null;
    }

    let error = null;

    if (instanceOfFile(fileOrDirectory) && instanceOfFile(f)) {
      error = { alreadyExists: true };
    } else if (instanceOfDirectory(fileOrDirectory) && instanceOfDirectory(f)) {
      error = { alreadyExists: true};
    }
    return error ? error : null;
  };
};

@Component({
  selector: 'ml-file-name-dialog',
  templateUrl: './file-name-dialog.component.html',
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
export class FileNameDialogComponent implements OnInit {

  form: FormGroup;

  constructor(
    public dialogRef: MdDialogRef<FileNameDialogComponent>,
    private formBuilder: FormBuilder,
    @Inject(MD_DIALOG_DATA) private data: NameDialogData
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
