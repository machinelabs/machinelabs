import { Component, OnInit, Input } from '@angular/core';
import { User } from '../../models/user';
import { Execution } from '../../models/execution';
import { UserService } from 'app/user/user.service';
import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'ml-execution-metadata',
  templateUrl: './execution-metadata.component.html',
  styleUrls: ['./execution-metadata.component.scss']
})
export class ExecutionMetadataComponent {
  _execution: Observable<Execution>;
  executer: Observable<User>;

  constructor(private userService: UserService) {
  }

  @Input()
  set execution (val: Observable<Execution>) {
    this._execution = val;
    this.executer = val.filter(e => !!e.user_id).switchMap(e => this.userService.getUser(e.user_id));
  }

  get execution () {
    return this._execution;
  }
}
