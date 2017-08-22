import {
  Component,
  Input,
  Output,
  EventEmitter,
  OnInit,
  OnDestroy,
  OnChanges
} from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { Lab } from '../../models/lab';
import { User } from '../../models/user';
import { UserService } from '../../user/user.service';
import { LabStorageService } from '../../lab-storage.service';

import 'rxjs/add/operator/do';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/switchMap';

export enum EditorToolbarActionTypes {
  Run, Save, Fork, Create, Edit, ForkAndRun
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
export class EditorToolbarComponent implements OnInit, OnChanges, OnDestroy {

  @Input() lab = null as Lab;

  @Output() action = new EventEmitter<EditorToolbarAction>();

  labOwner: Observable<User>;

  user: User;

  forkedLab: Lab;

  forkOwner: User;

  private userSubscription;

  EditorToolbarActionTypes = EditorToolbarActionTypes;

  constructor(public userService: UserService,
              private router: Router,
              private labStorageService: LabStorageService,
              private route: ActivatedRoute) {}

  ngOnChanges() {
    this.labOwner = this.userService.getUser(this.lab.user_id);
    this.forkedLab = null;
    this.forkOwner = null;
    if (this.lab.fork_of) {
      this.labStorageService
        .labExists(this.lab.fork_of)
        .filter(exists => exists)
        .switchMap(_ => this.labStorageService.getLab(this.lab.fork_of))
        .do(lab => this.forkedLab = lab)
        .switchMap(lab => this.userService.getUser(lab.user_id))
        .subscribe(user => this.forkOwner = user);
    }
  }

  ngOnInit() {
    this.userSubscription = this.userService.observeUserChanges()
                    .subscribe(user => this.user = user);
  }

  emitAction(action: EditorToolbarActionTypes, data?: any) {
    this.action.emit({ type: action, data });
  }

  ngOnDestroy() {
    this.userSubscription.unsubscribe();
  }
}
