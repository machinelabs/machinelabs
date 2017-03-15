import {Component, Input, Output, EventEmitter} from '@angular/core';
import {File} from '../../lab/models/lab';

import {LabBrowserAction} from '../actions/actions';
import {
  openFileAction,
  deleteFileAction,
  browseFilesAction
} from '../actions/browser-actions';

const MAIN_PYTHON_FILENAME = 'main.py';

@Component({
  selector: 'ml-file-tree',
  template: `
    <md-nav-list>
      <md-list-item *ngFor="let file of files" (click)="select(file)">
        {{file.name}} 
        <button md-raised-button 
            *ngIf="canRemove(file)" 
            (click)="remove(file)">
              <md-icon>delete</md-icon>
        </button>
      </md-list-item>
    </md-nav-list>
    <button md-raised-button md-button (click)="browseFiles()">Add File</button>
  `
})
export class FileTreeComponent {

  @Input() files: File[];
  @Output() action = new EventEmitter<LabBrowserAction>()

  protected select(file)  { this.action.emit(openFileAction(file)); }
  protected remove(file)  { this.action.emit(deleteFileAction(file)); }
  protected browseFiles() { this.action.emit(browseFilesAction()); }

  canRemove(file: File) {
    return file.name === MAIN_PYTHON_FILENAME ? false : this.files.length > 1;
  }
}
