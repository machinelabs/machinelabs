import { Component, Input, Output, EventEmitter, OnInit, OnDestroy } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { MdDialog, MdDialogRef } from '@angular/material';

import { UserService } from 'app/user/user.service';
import { RemoteLabExecService } from '../../editor/remote-code-execution/remote-lab-exec.service';
import { LabExecutionService } from '../../lab-execution.service';
import { EditorSnackbarService } from '../../editor/editor-snackbar.service';

import { User } from '../../models/user';
import { Execution, ExecutionStatus } from '../../models/execution';

import { EditExecutionDialogComponent } from '../edit-execution-dialog/edit-execution-dialog.component';

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

  editExecutionDialogRef: MdDialogRef<EditExecutionDialogComponent>;

  constructor(public userService: UserService,
              private labExecutionService: LabExecutionService,
              private editorSnackbar: EditorSnackbarService,
              private dialog: MdDialog,
              private rleService: RemoteLabExecService) {
  }

  ngOnInit() {
    this.userSubscription = this.userService.observeUserChanges()
                    .subscribe(user => this.user = user);
  }

  stop(execution: Execution) {
    this.rleService.stop(execution.id);
  }

  remove(execution: Execution) {
    execution.hidden = true;
    this.labExecutionService
        .updateExecution(execution)
        .switchMap(_ => this.editorSnackbar.notifyExecutionRemoved().onAction())
        .switchMap(_ => {
          execution.hidden = false;
          return this.labExecutionService.updateExecution(execution);
        })
        .subscribe(
          _ => this.editorSnackbar.notifyActionUndone(),
          _ => this.editorSnackbar.notifyError()
        );
  }

  showEditExecutionModal(execution: Execution) {
    this.editExecutionDialogRef = this.dialog.open(EditExecutionDialogComponent, {
      data: {
        execution: execution
      }
    });

    this.editExecutionDialogRef
        .afterClosed()
        .filter(name => name !== undefined)
        .switchMap(name => {
          execution.name = name;
          return this.labExecutionService.updateExecution(execution);
        })
        .subscribe(
          _ => this.editorSnackbar.notifyExecutionUpdated(),
          _ => this.editorSnackbar.notifyError()
        );
  }

  ngOnDestroy() {
    this.userSubscription.unsubscribe();
  }
}
