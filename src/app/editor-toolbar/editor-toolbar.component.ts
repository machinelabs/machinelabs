import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { MdSnackBar, MdDialogRef, MdDialog } from '@angular/material';
import { EditLabDialogComponent } from '../edit-lab-dialog/edit-lab-dialog.component';
import { Lab, LabExecutionContext } from '../models/lab';
import { User } from '../models/user';
import { AuthService } from '../auth/auth.service';
import { UserService } from '../user/user.service';

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
export class EditorToolbarComponent implements OnInit {

  @Input() lab = null as Lab;

  @Input() context: LabExecutionContext;

  @Output() action = new EventEmitter<EditorToolbarAction>();

  labOwner: Observable<User>;

  private user: User;

  EditorToolbarActionTypes = EditorToolbarActionTypes;

  editLabDialogRef: MdDialogRef<EditLabDialogComponent>;

  constructor(private authService: AuthService,
              private userService: UserService,
              private router: Router,
              private route: ActivatedRoute,
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

  emitAction(action: EditorToolbarActionTypes, data?: any) {
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
          this.router.navigate(['./', _lab.id], {
            relativeTo: this.route,
            queryParamsHandling: 'preserve'
          });
        });
  }
}
