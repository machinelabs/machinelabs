import {Component, Input, Output, EventEmitter} from '@angular/core';
import {MdDialog} from '@angular/material';

import {AddFileDialogComponent} from '../../shared/add-file-dialog/add-file-dialog.component';
import {File} from '../../lab/models/lab';
import {LabBrowserAction, LabBrowserActionTypes} from '../actions/actions';
import {addFileAction} from '../actions/browser-actions';

@Component({
  selector: 'ml-lab-navigator',
  template: `
    <div fxLayout="column" class="ml-sidebar">
      <div fxFlex-align="center" class="ml-sidebar__layout">
        <h2 class="ml-panel__title">Files</h2>
        <ml-file-tree 
            [files]="files"
            (action)="onActionRequest($event)">
        </ml-file-tree>
      </div>
    </div>
  `,
  styles: [
    ` :host { 
        display: flex;
        box-sizing: border-box;
        min-height:0;
        min-width : 300px;
        overflow: hidden;
        border-right: solid 6px #f2f8f8;
       }`, `
      .ml-sidebar {
        background-color: white;
        border-right: 5px solid #fff;
        width : 100%;
        padding-left : 20px;
      }`, `
      .ml-sidebar__layout {
        height: 100%;
      }
    `,`
      h2 {
        border-bottom : #f2f8f8 1px solid;
      }
    `,`
      .ml-panel__title {
        color: rgb(90, 90, 90);
        text-transform: uppercase;
        font-size: 0.7em;
        margin: 0;
        padding: 1.2em 1.5em;
        }
    `
  ]
})
export class LabNavigatorComponent {
  constructor(private _dialog: MdDialog) { }

  @Input() files: File[];
  @Output() action = new EventEmitter<LabBrowserAction>()

  // ****************************************
  // Internal protected methods
  // ****************************************

  protected onActionRequest(action) {
    switch(action.type) {
      case LabBrowserActionTypes.FILE_BROWSE :    // Browse and select a file
        this.openAddFileDialog();
        break;
      default :                                   // delegate to LabBrowser
        this.action.emit(action);
        break;
    }
  }
  /**
   *  Open browse dialog, select file, and then announce openFile request
   */
  protected openAddFileDialog() {
    let hasSelection = (filename) => (filename !== '' && filename !== undefined);
    this._dialog
        .open(AddFileDialogComponent, {disableClose: false})
        .afterClosed()
        .filter(hasSelection)
        .subscribe(filename => {             // ? does this auto-unsubscribe for a1x operation
          this.onActionRequest(addFileAction({
            name: filename, content: ''
          }));
        });
  }
}
