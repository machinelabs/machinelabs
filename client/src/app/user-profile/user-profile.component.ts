import { Router, ActivatedRoute } from '@angular/router';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { MatDialog, MatDialogRef, MatSnackBar } from '@angular/material';
import { Observable } from 'rxjs/Observable';
import { map, filter, switchMap } from 'rxjs/operators';

import { User } from '../models/user';
import { Lab } from '../models/lab';
import { Execution } from '../models/execution';
import { ExecutionStatus } from '@machinelabs/models';

import { LabStorageService } from '../lab-storage.service';
import { LabExecutionService } from '../lab-execution.service';
import { UserService } from '../user/user.service';

import { EditUserProfileDialogComponent } from './edit-user-profile-dialog/edit-user-profile-dialog.component';

@Component({
  selector: 'ml-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss']
})
export class UserProfileComponent implements OnInit, OnDestroy {

  labs: Array<Lab>;

  user: User;

  isAuthUser = false;

  editUserProfileDialog: MatDialogRef<EditUserProfileDialogComponent>;

  executions: Observable<Array<Observable<Execution>>>;

  ExecutionStatus = ExecutionStatus;

  private userChangesSubscription;

  constructor(private route: ActivatedRoute,
              private labStorage: LabStorageService,
              private dialog: MatDialog,
              private snackBar: MatSnackBar,
              private labExecutionService: LabExecutionService,
              private userService: UserService) {}

  ngOnInit() {
    this.route.data.pipe(map(data => data['user'])).subscribe(user => {
      this.user = user;
      this.executions = this.labExecutionService.observeExecutionsForUser(user);
    });

    this.route.data.pipe(map(data => data['labs']))
      .subscribe(labs => this.labs = labs);

    this.userChangesSubscription = this.userService.observeUserChanges()
      .pipe(switchMap(_ => this.userService.isLoggedInUser(this.user.id)))
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
    this.showEditDialog(this.user).pipe(
      filter(user => user),
      switchMap(user => this.userService.updateUser(user))
    ).subscribe(_ => this.snackBar.open('Profile updated.', 'Dismiss', { duration: 3000 }));
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
