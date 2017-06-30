import { Component, OnInit, OnDestroy, Input, EventEmitter, Output } from '@angular/core';
import { User } from '../../models/user';
import { Execution } from '../../models/execution';
import { UserService } from 'app/user/user.service';
import { Observable } from 'rxjs/Observable';
import { ExecutionStatus } from '../../models/execution';
import { RemoteLabExecService } from '../../lab-editor/remote-code-execution/remote-lab-exec.service';

import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/switchMap';

@Component({
  selector: 'ml-execution-metadata',
  templateUrl: './execution-metadata.component.html',
  styleUrls: ['./execution-metadata.component.scss']
})
export class ExecutionMetadataComponent implements OnInit, OnDestroy {

  _execution: Observable<Execution>;

  executer: Observable<User>;

  user: User;

  ExecutionStatus = ExecutionStatus;

  private userSubscription;

  @Output() listen = new EventEmitter<Execution>();
  @Output() restart = new EventEmitter<Execution>();

  constructor(public userService: UserService,
              private rleService: RemoteLabExecService) {
  }

  ngOnInit() {
    this.userSubscription = this.userService.observeUserChanges()
                    .subscribe(user => this.user = user);
  }

  @Input()
  set execution (val: Observable<Execution>) {
    this._execution = val;
    this.executer = val.filter(e => !!e.user_id).switchMap(e => this.userService.getUser(e.user_id));
  }

  get execution () {
    return this._execution;
  }

  stop(execution: Execution) {
    this.rleService.stop(execution.id);
  }

  ngOnDestroy() {
    this.userSubscription.unsubscribe();
  }
}
