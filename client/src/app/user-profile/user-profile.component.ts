import { Router, ActivatedRoute } from '@angular/router';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material';
import { Observable, forkJoin } from 'rxjs';
import { map, filter, switchMap, tap } from 'rxjs/operators';

import { User } from '../models/user';
import { Lab } from '../models/lab';
import { Execution } from '../models/execution';
import { ExecutionStatus } from '@machinelabs/models';

import { SnackbarService } from '../snackbar.service';
import { LabStorageService } from '../lab-storage.service';
import { LabExecutionService } from '../lab-execution.service';
import { UserService } from '../user/user.service';

import { EditUserProfileDialogComponent } from './edit-user-profile-dialog/edit-user-profile-dialog.component';

interface UserLab {
  lab: Lab;
  executions: Observable<Array<{ id: string; execution: Observable<Execution> }>>;
  user: Observable<User>;
}

@Component({
  selector: 'ml-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss']
})
export class UserProfileComponent implements OnInit, OnDestroy {
  userLabs$: Observable<Array<UserLab>>;

  user: User;

  isAuthUser = false;

  editUserProfileDialog: MatDialogRef<EditUserProfileDialogComponent>;

  ExecutionStatus = ExecutionStatus;

  private userChangesSubscription;

  constructor(
    private route: ActivatedRoute,
    private labStorage: LabStorageService,
    private dialog: MatDialog,
    private snackBar: SnackbarService,
    private labExecutionService: LabExecutionService,
    private userService: UserService
  ) {}

  ngOnInit() {
    this.route.data.pipe(map(data => data['user'])).subscribe(user => (this.user = user));

    this.userLabs$ = this.route.data.pipe(map(data => data['labs'])).pipe(
      map(labs =>
        labs.map(lab => ({
          lab,
          user: this.user,
          executions: this.observeRecentExecutionsForLab(lab)
        }))
      )
    );

    this.userChangesSubscription = this.userService
      .observeUserChanges()
      .pipe(switchMap(_ => this.userService.isLoggedInUser(this.user.id)))
      .subscribe(isLoggedIn => (this.isAuthUser = isLoggedIn));

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
      .pipe(
        filter(user => user),
        switchMap(user => this.userService.updateUser(user))
      )
      .subscribe(_ => this.snackBar.notifyProfileUpdated());
  }

  showEditDialog(user: User) {
    return this.dialog
      .open(EditUserProfileDialogComponent, {
        data: {
          user: user
        }
      })
      .afterClosed();
  }

  ngOnDestroy() {
    this.userChangesSubscription.unsubscribe();
  }

  private observeRecentExecutionsForLab(lab: Lab, limit = 3) {
    return this.labExecutionService.observeExecutionsForLab(lab).pipe(map(executions => executions.slice(0, limit)));
  }
}
