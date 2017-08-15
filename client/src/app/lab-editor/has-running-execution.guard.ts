import { Injectable } from '@angular/core';
import { CanDeactivate, ActivatedRouteSnapshot, RouterStateSnapshot} from '@angular/router';
import { MdDialog } from '@angular/material';
import { Observable } from 'rxjs/Observable';

import { UserService } from '../user/user.service';
import { LabStorageService } from '../lab-storage.service';
import { EditorViewComponent } from './editor-view/editor-view.component';
import {
  NavigationConfirmDialogComponent,
  NavigationConfirmReason
} from './navigation-confirm-dialog/navigation-confirm-dialog.component';

import { LabExecutionService } from '../lab-execution.service';

import 'rxjs/add/observable/forkJoin';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/switchMap';

@Injectable()
export class HasRunningExecutionGuard implements CanDeactivate<EditorViewComponent> {

  constructor (
    private labExecutionService: LabExecutionService,
    private dialog: MdDialog,
    private userService: UserService,
    private labStorageService: LabStorageService
  ) {}

  canDeactivate(
    component: EditorViewComponent,
    currentRoute: ActivatedRouteSnapshot,
    currentState: RouterStateSnapshot,
    nextState: RouterStateSnapshot
  ) {
    const labId = currentRoute.paramMap.get('id');

    // if we're about to navigate to another execution
    // e.g. the current labId is in the next state as well,
    // we can simply resolve because we aren't leaving execution
    // view.
    if (nextState.url.indexOf(labId) > -1) {
      return Observable.of(true);
    }

    return Observable.forkJoin(
      this.labStorageService.getLab(labId),
      this.userService.observeUserChanges().take(1)
    )
    // It might not be obvious why we're doing a forkJoin here, but we have to
    // resolve the loggedin user first so we can access state in isLoggedInUser
    .switchMap(val => this.userService.isLoggedInUser(val[0].user_id))
    .switchMap(userOwnsLab => {
      if (!userOwnsLab) {
        return Observable.of(true);
      }
      return this.labExecutionService
        .labHasRunningExecutions(labId)
        .switchMap(val => val ? this.showDialog() : Observable.of(true));
    });
  }

  private showDialog() {
    return this.dialog
      .open(NavigationConfirmDialogComponent, {
        data: {
          reason: NavigationConfirmReason.RunningExecutions
        }
      })
      .afterClosed();
  }
}

