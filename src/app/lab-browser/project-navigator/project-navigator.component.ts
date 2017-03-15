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
        <h3 md-subheader>Files</h3>
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
        min-width : 200px;
        overflow: hidden;
       }`, `
      .ml-sidebar {
        background-color: rgba(226, 226, 226, 1);
        border-right: 5px solid #fff;
        width : 100%;
        padding-left : 20px;
      }`, `
      .ml-sidebar__layout {
        height: 100%;
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
        .subscribe(filename => {             // ? does this auto-unsubscrive for a1x operation
          this.onActionRequest(addFileAction({
            name: filename, content: ''
          }));
        });
  }
}
