import {Component, Output, Input, EventEmitter} from '@angular/core';

import {User} from '../../api';
import {LabExecutionContext} from '../../lab';
import {LabBrowserAction} from '../actions/actions';
import {
  configLabAction, runLabAction, forkLabAction,  saveLabAction, stopLabAction,
  loginUserAction, logoutUserAction, viewUserProfileAction
} from '../actions/browser-actions';

@Component({
  selector: 'ml-lab-toolbar',
  templateUrl: 'lab-toolbar.component.html',
  styleUrls: ['lab-toolbar.component.scss']
})
export class LabToolbarComponent {
  @Input() user: User;
  @Input() context: LabExecutionContext;
  @Output() action = new EventEmitter<LabBrowserAction>();


  // *****************************************************
  // Internal protected methods delegate to external
  // *****************************************************

  protected edit()    { this.action.emit(configLabAction(this.context)); }
  protected stop()    { this.action.emit(stopLabAction(this.context)); }
  protected run()     { this.action.emit(runLabAction(this.context.lab)); }
  protected save()    { this.action.emit(saveLabAction(this.context.lab)); }
  protected fork()    { this.action.emit(forkLabAction(this.context.lab)); }

  protected login()   { this.action.emit(loginUserAction(this.user)); }
  protected logout()  { this.action.emit(logoutUserAction(this.user)); }
  protected viewProfile()  { this.action.emit(viewUserProfileAction(this.user)); }
}
