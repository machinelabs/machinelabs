import { Component, Input, Output, EventEmitter } from '@angular/core';
import { File } from '../models/lab';

const MAIN_PYTHON_FILENAME = 'main.py';

@Component({
  selector: 'ml-file-tree',
  templateUrl: './file-tree.component.html',
  styleUrls: ['./file-tree.component.scss']
})
export class FileTreeComponent {

  @Input() files: File[];

  @Input() selectedFile;

  @Output() selectFile = new EventEmitter<File>();

  @Output() editFile = new EventEmitter<File>();

  @Output() removeFile = new EventEmitter<File>();

  @Output() addFile = new EventEmitter();

  isRemovable(file: File) {
    return file.name === MAIN_PYTHON_FILENAME ? false : this.files.length > 1;
  }

  emitSelectFile(event, file: File) {
    if (event.target.nodeName === 'LI') {
      this.selectFile.emit(file);
    }
  }
}
