import { Component, Input } from '@angular/core';
import { MdDialog, MdDialogRef } from '@angular/material';

import { FileNameDialogComponent } from '../file-name-dialog/file-name-dialog.component';

import { EditorService } from '../editor.service';
import { File } from '../../models/lab';

const MAIN_PYTHON_FILENAME = 'main.py';

@Component({
  selector: 'ml-file-tree',
  templateUrl: './file-tree.component.html',
  styleUrls: ['./file-tree.component.scss']
})
export class FileTreeComponent {

  set files(files: File[]) {
    this.editorService.lab.directory = files;
  }

  get files(): File[] {
    return this.editorService.lab.directory;
  }

  get selectedFile(): File {
    return this.editorService.activeFile;
  }

  fileNameDialogRef: MdDialogRef<FileNameDialogComponent>;

  @Input() showActionButtons = true;

  constructor(
    private editorService: EditorService,
    public dialog: MdDialog
  ) {}

  isRemovable(file: File) {
    return file.name === MAIN_PYTHON_FILENAME ? false : this.files.length > 1;
  }

  selectFile(event, file: File) {
    if (event.target.nodeName === 'LI') {
      this.editorService.openFile(file);
    }
  }

  openFileNameDialog(file?: File) {
    this.fileNameDialogRef = this.dialog.open(FileNameDialogComponent, {
      disableClose: false,
      data: {
        fileName: file ? file.name :  ''
      }
    });

    this.fileNameDialogRef.afterClosed()
      .filter(name => name !== '' && name !== undefined)
      .subscribe(name => {
        if (!file) {
          const newFile = { name, content: '' };
          this.editorService.lab.directory.push(newFile);
          this.editorService.openFile(newFile);
        } else {
          this.updateFile(file, { name, content: file.content});
        }
      });
  }

  updateFile(file: File, newFile: File) {
    const index = this.editorService.lab.directory.findIndex(f => f.name === file.name);
    if (index !== -1) {
      this.editorService.lab.directory[index] = newFile;
    }
  }

  deleteFile(file: File) {
    this.editorService.lab.directory.splice(this.editorService.lab.directory.indexOf(file), 1);
    this.editorService.openFile(this.editorService.lab.directory[0]);
  }
}
