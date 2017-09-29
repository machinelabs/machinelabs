import { Component, Input, Optional, SkipSelf } from '@angular/core';
import { File, LabDirectory, Directory, instanceOfFile, instanceOfDirectory } from '@machinelabs/core/models/directory';

import { EditorService } from '../editor.service';
import { LabDirectoryService } from '../../lab-directory.service';
import { getMainFile } from '../util/file-tree-helper';

@Component({
  selector: 'ml-file-list',
  templateUrl: './file-list.component.html',
  styleUrls: ['./file-list.component.scss']
})
export class FileListComponent {


  get selectedFile(): File {
    return this.editorService.activeFile;
  }

  @Input() showActionButtons = true;

  @Input() directory = null as Directory;

  @Input() mandatoryFiles: Array<string> = [];

  constructor(
    public editorService: EditorService,
    @Optional() @SkipSelf() public parent: FileListComponent,
    private labDirectoryService: LabDirectoryService) {}

  isRemovable(file: File) {
    return !this.isMandatoryFile(file);
  }

  isEditable(file: File) {
    return !this.isMandatoryFile(file);
  }

  selectFile(event, file: File) {
    if (instanceOfFile(file) && event.target.nodeName === 'LI') {
      const path = `${this.getFileTreePath()}/${file.name}`
      this.editorService.openFile(file, path);
    }
  }

  deleteFileOrDirectory(fileOrDirectory: File|Directory) {
    this.labDirectoryService.deleteFromDirectory(fileOrDirectory, this.directory);
    this.editorService.openFile(getMainFile(this.editorService.lab.directory));
  }

  openFolderNameDialog(parentDirectory: Directory, directory?: Directory) {
    this.editorService.openFolderNameDialog(parentDirectory, directory);
  }

  openFileNameDialog(parentDirectory: Directory, file?: File) {
    this.editorService.openFileNameDialog(parentDirectory, file);
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
