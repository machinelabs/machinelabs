import { Component, Input, Output, EventEmitter, OnInit, OnDestroy } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { MatDialog, MatDialogRef } from '@angular/material';

import { UserService } from 'app/user/user.service';
import { RemoteLabExecService } from '../../editor/remote-code-execution/remote-lab-exec.service';
import { LabExecutionService } from '../../lab-execution.service';
import { SnackbarService } from '../../snackbar.service';

import { User } from '../../models/user';
import { Execution } from '../../models/execution';
import { ExecutionStatus } from '@machinelabs/models';

import { EditExecutionDialogComponent } from '../edit-execution-dialog/edit-execution-dialog.component';
import { switchMap, filter } from 'rxjs/operators';

@Component({
  selector: 'ml-execution-list',
  templateUrl: './execution-list.component.html',
  styleUrls: ['./execution-list.component.scss']
})
export class ExecutionListComponent implements OnInit, OnDestroy {
  @Input() executions: Array<Observable<Execution>>;

  @Input() activeId: string;

  @Output() restart = new EventEmitter<Execution>();

  @Output() view = new EventEmitter<Execution>();

  ExecutionStatus = ExecutionStatus;

  user: User;

  private userSubscription;

  editExecutionDialogRef: MatDialogRef<EditExecutionDialogComponent>;

  constructor(
    public userService: UserService,
    private labExecutionService: LabExecutionService,
    private snackbarService: SnackbarService,
    private dialog: MatDialog,
    private rleService: RemoteLabExecService
  ) {}

  ngOnInit() {
    this.userSubscription = this.userService.observeUserChanges().subscribe(user => (this.user = user));
  }

  stop(execution: Execution) {
    this.rleService.stop(execution.id);
  }

  remove(execution: Execution) {
    execution.hidden = true;
    this.labExecutionService
      .updateExecution(execution)
      .pipe(
        switchMap(_ => this.snackbarService.notifyExecutionRemoved().onAction()),
        switchMap(_ => {
          execution.hidden = false;
          return this.labExecutionService.updateExecution(execution);
        })
      )
      .subscribe(_ => this.snackbarService.notifyActionUndone(), _ => this.snackbarService.notifyError());
  }

  showEditExecutionModal(execution: Execution) {
    this.editExecutionDialogRef = this.dialog.open(EditExecutionDialogComponent, {
      data: {
        execution: execution
      }
    });

    this.editExecutionDialogRef
      .afterClosed()
      .pipe(
        filter(name => name !== undefined),
        switchMap((name: string) => {
          execution.name = name;
          return this.labExecutionService.updateExecution(execution);
        })
      )
      .subscribe(_ => this.snackbarService.notifyExecutionUpdated(), _ => this.snackbarService.notifyError());
  }

  ngOnDestroy() {
    this.userSubscription.unsubscribe();
  }
}
