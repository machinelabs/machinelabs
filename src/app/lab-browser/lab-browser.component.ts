import {Component, OnInit} from '@angular/core';
import {Observable} from 'rxjs/Observable';

import {User} from '../api/models/user';
import {AuthService} from '../api/auth/auth.service';
import {Lab, LabExecutionContext, File} from '../lab/models/lab';
import {LabBrowserAction, LabBrowserActionTypes} from './actions/actions';
import {DUMMY_LAB} from '../lab/data/dummy.data';

@Component({
  selector: 'ml-lab-browser',
  styles: [
    `  :host { display: block; height: 100%}`,
    `  .editor-view-content { height :100%; } `
  ],
  template: `
    <div fxLayout="column">
      <ml-lab-toolbar [user]="user" [context]="context" (action)="onLabAction($event)"></ml-lab-toolbar>
      <div fxLayout="row" class="editor-view-content">
        <ml-lab-navigator *ngIf="showNavigator"
            [files]="lab.files"  
            (action)="onNavigationAction($event)">
        </ml-lab-navigator>
        <ml-code-editor fxFlex fxLayout="row" role="main"
            [file]="current" 
            [output]="output"> 
         </ml-code-editor>
      </div>  
      <ml-lab-footer [context]="context" (action)="onLabAction($event)"></ml-lab-footer>
    </div>
  `
})
export class LabBrowserComponent implements OnInit {
  public showNavigator = true;
  public lab: Lab;
  public current: File;
  public user: User;
  public context: LabExecutionContext;
  public output: Observable<string>;

  constructor(private authService: AuthService) {
    this.buildDummyData();
  }

  ngOnInit() {
      this.lab = this.context.lab;
      this.current = this.lab.files[0];
      this.output = Observable.of(this.current.content);
  }

  // ****************************************
  // Internal protected methods
  // ****************************************

  /**
   * Actions that originate from the toolbar or footer
   */
  protected onLabAction(action : LabBrowserAction) {
    console.log(`LabBrowserAction = [${action.type}]`);

    switch(action.type) {
      case LabBrowserActionTypes.LAB_RUN      : break;
      case LabBrowserActionTypes.LAB_SAVE     : break;
      case LabBrowserActionTypes.LAB_STOP     : break;
      case LabBrowserActionTypes.LAB_FORK     : break;
      case LabBrowserActionTypes.LAB_SHARE    : break;
      case LabBrowserActionTypes.LAB_EMBED    : break;

      case LabBrowserActionTypes.USER_LOGIN   : break; //this.authService.signInWithGitHub().subscribe();  break;
      case LabBrowserActionTypes.USER_LOGOUT  : break; //this.authService.signOut().subscribe(); break;
      case LabBrowserActionTypes.USER_PROFILE : break; //this.authService.signOut().subscribe(); break;

      case LabBrowserActionTypes.HIDE_SIDEBAR : this.showNavigator = false;  break;
      case LabBrowserActionTypes.SHOW_SIDEBAR : this.showNavigator = true;   break;
    }
  }

  /**
   * Actions that originate from the Lab Navigator sidebar
   */
  protected onNavigationAction(action : LabBrowserAction) {
    console.log(`LabBrowserAction = [${action.type}] for '${(action.target as File).name}'`);

    switch(action.type) {
      case LabBrowserActionTypes.FILE_ADD     : break;
      case LabBrowserActionTypes.FILE_DELETE  : break;
      case LabBrowserActionTypes.FILE_OPEN    : this.current = (action.target as File);  break;
    }
  }


  protected buildDummyData() {
    this.context = new LabExecutionContext(DUMMY_LAB, "37");
    this.user = {
      uid : '47822',
      displayName : "Thomas Burleson",
      email : "thomas@thoughtram.io",
      isAnonymous : true,
      photoUrl : null
    }
  }
}
