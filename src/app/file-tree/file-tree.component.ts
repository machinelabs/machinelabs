import { Component, Input, Output, EventEmitter } from '@angular/core';
import { File } from '../models/lab';

const MAIN_PYTHON_FILENAME = 'main.py';

@Component({
  selector: 'ml-file-tree',
  template: `
    <ul class="ml-file-list">
      <li
        class="ml-file-list__item"
        *ngFor="let file of files"
        (click)="selectFile.next(file)"
        [ngClass]="{ selected: selectedFile && selectedFile.name == file.name }">

        <md-icon>description</md-icon> {{file.name}} <button class="ml-file-tree__cta--delete" *ngIf="isRemovable(file)" (click)="removeFile.next(file)"><md-icon>delete_forever</md-icon></button>
      </li>
    </ul>
    <div class="ml-file-tree__cta-bar">
      <button md-button (click)="addFile.next()" class="ml-file-tree__cta">
        <md-icon>note_add</md-icon> Add file
      </button>
    </div>
  `,
  styleUrls: ['./file-tree.component.scss']
})
export class FileTreeComponent {

  @Input() files: File[];

  @Input() selectedFile;

  @Output() selectFile = new EventEmitter<File>();

  @Output() removeFile = new EventEmitter<File>();

  @Output() addFile = new EventEmitter();

  isRemovable(file: File) {
    return file.name === MAIN_PYTHON_FILENAME ? false : this.files.length > 1;
  }
}
