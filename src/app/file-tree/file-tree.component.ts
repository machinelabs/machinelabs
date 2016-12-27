import { Component, Input, Output, EventEmitter } from '@angular/core';
import { File } from '../models/lab';

const MAIN_PYTHON_FILENAME = 'main.py';

@Component({
  selector: 'ml-file-tree',
  template: `
    <md-nav-list>
      <md-list-item *ngFor="let file of files" (click)="selectFile.next(file)">
        {{file.name}} <button md-raised-button *ngIf="isRemovable(file)" (click)="removeFile.next(file)"><md-icon>delete</md-icon></button>
      </md-list-item>
    </md-nav-list>
    <button md-raised-button md-button (click)="addFile.next()">Add File</button>
  `
})
export class FileTreeComponent {

  @Input() files: File[];

  @Output() selectFile = new EventEmitter<File>();

  @Output() removeFile = new EventEmitter<File>();

  @Output() addFile = new EventEmitter();

  isRemovable(file: File) {
    return file.name === MAIN_PYTHON_FILENAME ? false : this.files.length > 1;
  }
}
