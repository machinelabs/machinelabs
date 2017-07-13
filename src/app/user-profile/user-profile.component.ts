import { Router, ActivatedRoute } from '@angular/router';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { MdDialog, MdDialogRef, MdSnackBar } from '@angular/material';
import { Observable } from 'rxjs/Observable';

import { User } from '../models/user';
import { Lab } from '../models/lab';

import { LabStorageService } from '../lab-storage.service';
import { UserService } from '../user/user.service';

import { EditUserProfileDialogComponent } from './edit-user-profile-dialog/edit-user-profile-dialog.component';

import 'rxjs/add/observable/of';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/switchMap';

@Component({
  selector: 'ml-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss']
})
export class UserProfileComponent implements OnInit, OnDestroy {

  labs: Array<Lab>;
  user: User;
  isAuthUser = false;
  editUserProfileDialog: MdDialogRef<EditUserProfileDialogComponent>;

  private userChangesSubscription;

  constructor(private route: ActivatedRoute,
              private labStorage: LabStorageService,
              private dialog: MdDialog,
              private snackBar: MdSnackBar,
              private userService: UserService) {}

  ngOnInit() {
    this.route.data
        .map(data => data['user'])
        .subscribe(user => this.user = user);

    this.route.data
        .map(data => data['labs'])
        .subscribe(labs => this.labs = labs);

    this.userChangesSubscription = this.userService
                                        .observeUserChanges()
                                        .switchMap(_ => this.userService.isLoggedInUser(this.user.id))
                                        .subscribe(isLoggedIn => this.isAuthUser = isLoggedIn);

    // Need to wrap this in a timeout, otherwise we're running into an
    // ExpressionChangedAfterItHasBeenCheckedError.
    setTimeout(() => {
      if (this.route.snapshot.queryParamMap.get('editing') && this.isAuthUser) {
        this.edit();
      }
    });
  }

  edit() {
    this.showEditDialog(this.user)
        .filter(user => user)
        .switchMap(user => this.userService.updateUser(user))
        .subscribe(_ => this.snackBar.open('Profile updated.', 'Dismiss', { duration: 3000 }));
  }

  showEditDialog(user: User) {
    return this.dialog.open(EditUserProfileDialogComponent, {
      data: {
        user: user
      }
    }).afterClosed();
  }

  ngOnDestroy() {
    this.userChangesSubscription.unsubscribe();
  }
}
