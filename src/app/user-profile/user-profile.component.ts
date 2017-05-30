import { Router, ActivatedRoute } from '@angular/router';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { MdDialog, MdDialogRef, MdSnackBar } from '@angular/material';
import { Observable } from 'rxjs/Observable';

import { User } from '../models/user';
import { Lab } from '../models/lab';

import { LabStorageService } from '../lab-storage.service';
import { UserService } from '../user/user.service';

import { EditUserProfileDialogComponent } from './edit-user-profile-dialog/edit-user-profile-dialog.component';

@Component({
  selector: 'ml-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss']
})
export class UserProfileComponent implements OnInit, OnDestroy {

  labs: Observable<Array<Lab>>;
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
    this.user = this.route.snapshot.data['user'];
    this.labs = this.route.snapshot.data['labs'];

    this.userChangesSubscription = this.userService
                                        .observeUserChanges()
                                        .switchMap(_ => this.userService.isLoggedInUser(this.user.id))
                                        .subscribe(isLoggedIn => this.isAuthUser = isLoggedIn);
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
