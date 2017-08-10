import { Component, OnInit, Inject } from '@angular/core';
import { MdDialogRef, MD_DIALOG_DATA } from '@angular/material';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs/Observable';

import { LabStorageService } from '../../lab-storage.service';
import { Lab } from '../../models/lab';

export interface EditLabDialogOptions {
  hideCancelButton: boolean;
}

export enum EditLabDialogActions {
  Save, Delete, Cancel
}

@Component({
  selector: 'ml-edit-lab-dialog',
  templateUrl: './edit-lab-dialog.component.html',
  styleUrls: ['./edit-lab-dialog.component.scss']
})
export class EditLabDialogComponent implements OnInit {

  form: FormGroup;

  lab: Lab;

  EditLabDialogActions = EditLabDialogActions;

  labExists: Observable<boolean>;

  constructor(
    private dialogRef: MdDialogRef<EditLabDialogComponent>,
    private formBuilder: FormBuilder,
    private labStorageService: LabStorageService,
    @Inject(MD_DIALOG_DATA) public data: any
  ) { }

  ngOnInit() {
    this.lab = this.data.lab;
    this.form = this.formBuilder.group({
      name: [this.lab.name, Validators.required],
      description: this.lab.description,
      tags: this.lab.tags ? this.lab.tags.join(',') : ''
    });

    this.labExists = this.labStorageService.labExists(this.lab.id)
  }

  submit(data) {
    this.lab.name = data.name;
    this.lab.description = data.description;
    this.lab.tags = data.tags.split(',').filter(tag => tag.trim() !== '');
    this.close(this.lab, EditLabDialogActions.Save);
  }

  close(lab: Lab, action: EditLabDialogActions) {
    this.dialogRef.close({ lab, action });
  }
}
