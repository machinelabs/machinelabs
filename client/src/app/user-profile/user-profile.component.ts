import * as firebase from 'firebase';

import { Router, ActivatedRoute } from '@angular/router';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { MdDialog, MdDialogRef, MdSnackBar } from '@angular/material';
import { Observable } from 'rxjs/Observable';

import { User, LoginUser } from '../models/user';
import { Lab } from '../models/lab';
import { Execution, ExecutionStatus } from '../models/execution';

import { LabStorageService } from '../lab-storage.service';
import { LabExecutionService } from '../lab-execution.service';
import { UserService } from '../user/user.service';
import { AuthService } from "../auth";

import { EditUserProfileDialogComponent } from './edit-user-profile-dialog/edit-user-profile-dialog.component';

import 'rxjs/add/observable/of';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/let';

enum Providers {
  Github = 'github.com',
  Google = 'google.com'
}

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

  executions: Observable<Array<Observable<Execution>>>;

  ExecutionStatus = ExecutionStatus;

  providers: Map<string, any>;

  private userChangesSubscription;

  constructor(private router: Router,
              private route: ActivatedRoute,
              private labStorage: LabStorageService,
              private dialog: MdDialog,
              private snackBar: MdSnackBar,
              private labExecutionService: LabExecutionService,
              private userService: UserService,
              private authService: AuthService) {}

  ngOnInit() {
    // We could extract this into a configuration or something. Ideas? I used a Map / Iterable
    // so I can easily iterate over this in the template with a new pipe I created (mapToIterable).
    // This makes it much more extensible.
    this.providers = new Map();
    this.providers.set(Providers.Github, { name: 'Github', authProvider: new firebase.auth.GithubAuthProvider() });
    this.providers.set(Providers.Google, { name: 'Google', authProvider: new firebase.auth.GoogleAuthProvider() });

    this.route.data
        .map(data => data['user'])
        .subscribe(user => {
          this.user = user;
          this.executions = this.labExecutionService.observeExecutionsForUser(user);
        });

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

  link(providerId: string) {
    this.authService.link(this.providers.get(providerId).authProvider)
                    .let(this.updateUser.bind(this))
                    .subscribe((user: User) => {
                      this.router.navigate(['/user', user.id]);
                    });
  }

  unlink(providerId: string) {
    this.authService.unlink(providerId)
                    .let(this.updateUser.bind(this))
                    .subscribe();
  }

  updateUser(source: Observable<LoginUser>) {
    return source.switchMap(user => this.userService.updateProviders(user))
                 // This is necessary to update the UI accordingly because we have no live connection
                 // to the user yet. Not sure if a live stream is more better because after all it's
                 // just a profile page. However, we could reduce some unnecessary code.
                 .do(user => this.user = user);
  }

  // I am using this function from within the template of this component. It's called quite often
  // due to Change Detection runs. With a small collection this has no impact on the performance
  // I suppose. Still this could probably be refactored.
  isLinked(providerId: string) {
    this.userService.isLinked(this.user, providerId);
  }

  get hasMultipleProviders() {
    return this.userService.hasMultipleProviders(this.user);
  }
}
