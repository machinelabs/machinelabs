import { Injectable } from '@angular/core';
import { CanDeactivate, ActivatedRouteSnapshot, RouterStateSnapshot} from '@angular/router';
import { MdDialog } from '@angular/material';
import { Observable } from 'rxjs/Observable';

import { EditorViewComponent } from './editor-view/editor-view.component';
import {
  NavigationConfirmDialogComponent,
  NavigationConfirmReason
} from './navigation-confirm-dialog/navigation-confirm-dialog.component';

import { LabExecutionService } from '../lab-execution.service';

@Injectable()
export class HasRunningExecutionGuard implements CanDeactivate<EditorViewComponent> {

  constructor (private labExecutionService: LabExecutionService, private dialog: MdDialog) {}

  canDeactivate(
    component: EditorViewComponent,
    currentRoute: ActivatedRouteSnapshot,
    currentState: RouterStateSnapshot,
    nextState: RouterStateSnapshot
  ) {
    const labId = currentRoute.paramMap.get('id');

    if (nextState.url.indexOf(labId) > -1) {
      return Observable.of(true);
    }

    return this.labExecutionService
        .labHasRunningExecutions(labId)
        .switchMap(val => val ? this.showDialog() : Observable.of(true));
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

