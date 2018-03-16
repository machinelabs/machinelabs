import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { Observable } from 'rxjs/Observable';
import { forkJoin } from 'rxjs/observable/forkJoin';

import { LabStorageService } from '../../lab-storage.service';
import { UserService } from '../../user/user.service';
import { Lab } from '../../models/lab';
import { PlanId } from '@machinelabs/models';

export interface EditLabDialogOptions {
  hideCancelButton: boolean;
}

export enum EditLabDialogActions {
  Save,
  Delete,
  Cancel
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

  hasPrivateLabs = true;

  constructor(
    private dialogRef: MatDialogRef<EditLabDialogComponent>,
    private formBuilder: FormBuilder,
    private labStorageService: LabStorageService,
    private userService: UserService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit() {
    this.lab = this.data.lab;
    this.form = this.formBuilder.group({
      name: [this.lab.name, Validators.required],
      description: this.lab.description,
      tags: this.lab.tags ? this.lab.tags.join(',') : '',
      isPrivate: new FormControl({
        value: this.lab.is_private,
        disabled: true
      })
    });

    this.labExists = this.labStorageService.labExists(this.lab.id);

    this.userService.getUserPlan().subscribe(plan => {
      this.hasPrivateLabs = plan && plan.plan_id !== PlanId.Beta;
      this.hasPrivateLabs ? this.form.get('isPrivate').enable() : this.form.get('isPrivate').disable();
    });
  }

  submit(data) {
    this.lab.name = data.name;
    this.lab.description = data.description;
    this.lab.tags = data.tags.split(',').filter(tag => tag.trim() !== '');
    this.lab.is_private = !!data.isPrivate;
    this.close(this.lab, EditLabDialogActions.Save);
  }

  close(lab: Lab, action: EditLabDialogActions) {
    this.dialogRef.close({ lab, action });
  }
}
