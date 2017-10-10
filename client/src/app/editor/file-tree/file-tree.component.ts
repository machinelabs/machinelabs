import { Component, Input, Optional, SkipSelf } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import {
  File,
  LabDirectory,
  Directory,
  instanceOfFile,
  instanceOfDirectory
} from '@machinelabs/core/models/directory';

import { EditorService } from '../editor.service';
import { NameDialogService } from '../name-dialog/name-dialog-service';
import { LabDirectoryService } from '../../lab-directory.service';
import { FileTreeService } from './file-tree.service';

@Component({
  selector: 'ml-file-tree',
  templateUrl: './file-tree.component.html',
  styleUrls: ['./file-tree.component.scss']
})
export class FileTreeComponent {

  @Input() showActionButtons = true;

  @Input() directory = null as Directory;

  @Input() mandatoryFiles: Array<string> = [];

  constructor(
    private editorService: EditorService,
    private nameDialogService: NameDialogService,
    @Optional() @SkipSelf() public parent: FileTreeComponent,
    private labDirectoryService: LabDirectoryService,
    public fileTreeService: FileTreeService) {}

  get level () {
    return this.parent ? this.parent.level + 1 : 0;
  }

  isRemovable(file: File) {
    return !this.isMandatoryFile(file);
  }

  isEditable(file: File) {
    return !this.isMandatoryFile(file);
  }

  selectFile(event, file: File) {
    if (instanceOfFile(file)) {
      const path = `${this.getFileTreePath()}/${file.name}`
      this.editorService.openFile(file, path);
    }
  }

  deleteFileOrDirectory(event: Event, fileOrDirectory: File|Directory) {
    this.stopEventPropagation(event);
    this.labDirectoryService.deleteFromDirectory(fileOrDirectory, this.directory);
    this.editorService.openFile(this.labDirectoryService.getMainFile(this.editorService.lab.directory));
  }

  openAddFolderNameDialog(event: Event, parentDirectory: Directory) {
    this.stopPropagationAndExpandDirectory(event, parentDirectory);
    this.nameDialogService.openAddFolderNameDialog(parentDirectory);
  }

  openEditFolderNameDialog(event: Event, parentDirectory: Directory, directory: Directory) {
    this.stopPropagationAndExpandDirectory(event, parentDirectory);
    this.nameDialogService.openEditFolderNameDialog(parentDirectory, directory);
  }

  stopPropagationAndExpandDirectory(event: Event, parentDirectory: Directory) {
    this.stopEventPropagation(event);
    this.fileTreeService.expandDirectory(parentDirectory);
  }

  openEditFileNameDialog(event: Event, parentDirectory: Directory, file: File) {
    this.handleFileDialog(event, nameDialogService => nameDialogService.openEditFileNameDialog(parentDirectory, file));
  }

  openAddFileNameDialog(event: Event, parentDirectory: Directory) {
    this.handleFileDialog(event, nameDialogService => nameDialogService.openAddFileNameDialog(parentDirectory));
  }

  handleFileDialog(event: Event, dialogFn: (editorService: NameDialogService) => Observable<File>) {
    this.stopEventPropagation(event);
    dialogFn(this.nameDialogService).subscribe(file => this.selectFile(null, file));
  }

  private stopEventPropagation(event: Event) {
    if (event) {
      event.stopPropagation();
    }
  }

  private isMandatoryFile(file: File) {
    return this.mandatoryFiles.indexOf(file.name) > -1;
  }

  public getFileTreePath() {
    let path = [];
    let p = this.parent;
    path.push(this.directory.name);

    while (p !== null) {
      path.push(p.directory.name);
      p = p.parent;
    }

    path.reverse();
    return path.join('/');
  }
}
