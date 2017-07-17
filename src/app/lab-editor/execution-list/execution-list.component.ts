import { Component, Input, Output, EventEmitter, OnInit, OnDestroy } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { UserService } from 'app/user/user.service';
import { RemoteLabExecService } from '../../lab-editor/remote-code-execution/remote-lab-exec.service';
import { LabExecutionService } from '../../lab-execution.service';
import { EditorSnackbarService } from '../editor-snackbar.service';

import { User } from '../../models/user';
import { Execution, ExecutionStatus } from '../../models/execution';

@Component({
  selector: 'ml-execution-list',
  templateUrl: './execution-list.component.html',
  styleUrls: ['./execution-list.component.scss']
})
export class ExecutionListComponent implements OnInit, OnDestroy {

  @Input() executions: Array<Observable<Execution>>;

  @Input() activeId: string;

  @Output() restart = new EventEmitter<Execution>();

  ExecutionStatus = ExecutionStatus;

  user: User;

  private userSubscription;

  constructor(public userService: UserService,
              private labExecutionService: LabExecutionService,
              private editorSnackbar: EditorSnackbarService,
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
        .subscribe(
          _ => this.editorSnackbar.notifyExecutionRemoved(),
          _ => this.editorSnackbar.notifyError()
        );
  }

  ngOnDestroy() {
    this.userSubscription.unsubscribe();
  }
}
