import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { MdSnackBar, MdDialogRef, MdDialog } from '@angular/material';
import { EditLabDialogComponent } from '../edit-lab-dialog/edit-lab-dialog.component';
import { Lab, LabExecutionContext } from '../models/lab';
import { LoginUser, User } from '../models/user';
import { AuthService } from '../auth/auth.service';
import { UserService } from '../user/user.service';

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

  @Input() lab = null as Lab;

  @Input() context: LabExecutionContext;

  @Output() action = new EventEmitter<ToolbarAction>();

  labOwner: Observable<User>;

  private user: User;

  ToolbarActionTypes = ToolbarActionTypes;

  editLabDialogRef: MdDialogRef<EditLabDialogComponent>;

  constructor(private authService: AuthService,
              private userService: UserService,
              private router: Router,
              private dialog: MdDialog,
              private snackBar: MdSnackBar) {}

  ngOnInit() {
    this.userService.observeUserChanges()
                    .subscribe(user => this.user = user);

    this.labOwner = this.userService.getUser(this.lab.user_id);
  }

  userOwnsLab () {
    return this.lab && this.user && this.lab.user_id === this.user.id;
  }

  emitAction(action: ToolbarActionTypes, data?: any) {
    this.action.emit({ type: action, data });
  }

  openEditLabDialog(lab: Lab) {
    this.editLabDialogRef = this.dialog.open(EditLabDialogComponent, {
      disableClose: false,
      data: {
        lab: lab
      }
    });

    this.editLabDialogRef.afterClosed()
        .filter(_lab => _lab !== undefined)
        .subscribe(_lab => {
          this.snackBar.open('Lab saved', 'Dismiss', { duration: 3000 });
          this.router.navigateByUrl(`${_lab.id}`);
        });
  }

  loginWithGitHub() {
    this.authService.linkOrSignInWithGitHub()
                    .switchMap(loginUser => this.userService.createUserIfMissing())
                    .subscribe(user => {
      this.snackBar.open(`Logged in as ${user.displayName}`, 'Dismiss', { duration: 3000 });
    });
  }

  logout() {
    this.authService.signOut().subscribe(_ => {
      this.snackBar.open('Logged out successfully', 'Dismiss', { duration: 3000 });
    });
  }
}
