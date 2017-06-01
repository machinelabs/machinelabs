import { Component, Input, Output, EventEmitter, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { Lab, LabExecutionContext } from '../../models/lab';
import { ClientExecutionState } from '../../models/execution';
import { User } from '../../models/user';
import { UserService } from '../../user/user.service';

export enum EditorToolbarActionTypes {
  Run, Stop, Save, Fork, Create
}

export interface EditorToolbarAction {
  type: EditorToolbarActionTypes;
  data?: any;
}

@Component({
  selector: 'ml-editor-toolbar',
  templateUrl: './editor-toolbar.component.html',
  styleUrls: ['./editor-toolbar.component.scss']
})
export class EditorToolbarComponent implements OnInit, OnDestroy {

  @Input() lab = null as Lab;

  @Input() context: LabExecutionContext;

  @Output() action = new EventEmitter<EditorToolbarAction>();

  labOwner: Observable<User>;

  private user: User;

  private userSubscription;

  ClientExecutionState = ClientExecutionState;

  EditorToolbarActionTypes = EditorToolbarActionTypes;

  constructor(private userService: UserService,
              private router: Router,
              private route: ActivatedRoute) {}

  ngOnInit() {
    this.userSubscription = this.userService.observeUserChanges()
                    .subscribe(user => this.user = user);

    this.labOwner = this.userService.getUser(this.lab.user_id);
  }

  emitAction(action: EditorToolbarActionTypes, data?: any) {
    this.action.emit({ type: action, data });
  }

  ngOnDestroy() {
    this.userSubscription.unsubscribe();
  }
}
