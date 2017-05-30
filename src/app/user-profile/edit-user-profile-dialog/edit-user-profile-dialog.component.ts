import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MD_DIALOG_DATA, MdDialogRef } from '@angular/material';

import { User } from '../../models/user';

@Component({
  selector: 'ml-edit-user-profile-dialog',
  templateUrl: './edit-user-profile-dialog.component.html',
  styleUrls: ['./edit-user-profile-dialog.component.scss']
})
export class EditUserProfileDialogComponent implements OnInit {

  user: User;
  form: FormGroup;

  constructor(
    private dialogRef: MdDialogRef<EditUserProfileDialogComponent>,
    private formBuilder: FormBuilder,
    @Inject(MD_DIALOG_DATA) private data: any
  ) { }

  ngOnInit() {
    this.user = this.data.user;
    this.form = this.formBuilder.group({
      displayName: [this.user.displayName, Validators.required],
      bio: this.user.bio
    });
  }

  submit(data) {
    this.user.displayName = data.displayName;
    this.user.bio = data.bio;
    this.dialogRef.close(this.user);
  }
}

