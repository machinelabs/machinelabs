import { Component, OnInit, Inject } from '@angular/core';
import { MdDialogRef, MD_DIALOG_DATA } from '@angular/material';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { LabStorageService } from '../lab-storage.service';
import { Lab } from '../models/lab';

@Component({
  selector: 'ml-edit-lab-dialog',
  templateUrl: './edit-lab-dialog.component.html',
  styleUrls: ['./edit-lab-dialog.component.scss']
})
export class EditLabDialogComponent implements OnInit {

  form: FormGroup;
  lab: Lab;

  constructor(
    private dialogRef: MdDialogRef<EditLabDialogComponent>,
    private formBuilder: FormBuilder,
    private labStorageService: LabStorageService,
    @Inject(MD_DIALOG_DATA) private data: any
  ) { }

  ngOnInit() {
    this.lab = this.data.lab;
    this.form = this.formBuilder.group({
      name: [this.lab.name, Validators.required],
      description: this.lab.description,
      tags: this.lab.tags ? this.lab.tags.join(',') : '',
    });
  }

  submit(data) {
    this.lab.name = data.name;
    this.lab.description = data.description;
    this.lab.tags = data.tags.split(',').filter(tag => tag.trim() !== '');

    this.labStorageService
        .saveLab(this.lab)
        .subscribe(_ => this.dialogRef.close(this.lab));
  }
}
