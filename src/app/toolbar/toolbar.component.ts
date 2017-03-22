import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { MdSnackBar } from '@angular/material';
import { Lab, LabExecutionContext } from '../models/lab';
import { User } from '../models/user';
import { AuthService } from '../auth/auth.service';

export enum ToolbarActionTypes {
  Run, Stop, Save, Fork, Create
}

export interface ToolbarAction {
  type: ToolbarActionTypes;
  data?: any;
}

@Component({
  selector: 'ml-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss']
})
export class ToolbarComponent implements OnInit {

  @Input() lab: Lab;

  @Input() context: LabExecutionContext;

  @Output() action = new EventEmitter<ToolbarAction>();

  private user: User;

  ToolbarActionTypes = ToolbarActionTypes;

  constructor(private authService: AuthService, private snackBar: MdSnackBar) {}

  ngOnInit() {
    this.authService.requireAuth().subscribe(user => this.user = user);
  }

  userOwnsLab () {
    return this.lab && this.user && this.lab.user_id === this.user.uid;
  }

  emitAction(action: ToolbarActionTypes, data?: any) {
    this.action.emit({ type: action, data });
  }

  loginWithGitHub() {
    this.authService.linkOrSignInWithGitHub().subscribe(user => {
      this.snackBar.open(`Logged in as ${user.displayName}`, 'Dismiss', { duration: 3000 });
    });
  }

  logout() {
    this.authService.signOut().subscribe(_ => {
      this.snackBar.open('Logged out successfully', 'Dismiss', { duration: 3000 });
    });
  }
}
