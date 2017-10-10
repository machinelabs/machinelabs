import { Component, Input, Optional, SkipSelf, Output, EventEmitter } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import {
  File,
  LabDirectory,
  Directory,
  instanceOfFile,
  instanceOfDirectory
} from '@machinelabs/core/models/directory';

import { deleteFromDirectory } from '@machinelabs/core/io/lab-fs/manipulation';

import { NameDialogService } from '../name-dialog/name-dialog-service';
import { FileTreeService } from './file-tree.service';

export interface FileTreeEventArgs {
  target: File | Directory,
  parentDirectory: Directory,
  path: string,
  isFile: boolean
  isDirectory: boolean
}

type EventEmitterSelectorFn = (instance: FileTreeComponent) => EventEmitter<FileTreeEventArgs>;
type EventEmitterSetterFn = (instance: FileTreeComponent, emitter: EventEmitter<FileTreeEventArgs>) => void;

@Component({
  selector: 'ml-file-tree',
  templateUrl: './file-tree.component.html',
  styleUrls: ['./file-tree.component.scss']
})
export class FileTreeComponent {

  @Input() showActionButtons = true;

  @Input() directory = null as Directory;

  @Input() mandatoryFiles: Array<string> = [];

  // Only the outermost FileTreeComponent instance should
  // create EventEmitter instances as events are always raised
  // on the outermost FileTreeComponent. Hence, creating those
  // on every level would be a waste of memory.

   _remove: EventEmitter<FileTreeEventArgs> = null;

   _addFile: EventEmitter<FileTreeEventArgs> = null;

   _editFile: EventEmitter<FileTreeEventArgs> = null;

   _selectFile: EventEmitter<FileTreeEventArgs> = null;

   // All these outputs look recursively for the EventEmitter on the
   // outermost FileTreeComponent or create if the outermost component
   // is reached.

    @Output() get remove() {
      return this.lookupOrCreateReturn(
        compInstance => compInstance.remove,
        compInstance => compInstance._remove,
        (compInstance, val) => compInstance._remove = val
      );
    }

    @Output() get addFile () {
      return this.lookupOrCreateReturn(
        compInstance => compInstance.addFile,
        compInstance => compInstance._addFile,
        (compInstance, val) => compInstance._addFile = val
      );
    }

    @Output() get editFile () {
      return this.lookupOrCreateReturn(
        compInstance => compInstance.editFile,
        compInstance => compInstance._editFile,
        (compInstance, val) => compInstance._editFile = val
      );
    }

    @Output() get selectFile () {
      return this.lookupOrCreateReturn(
        compInstance => compInstance.selectFile,
        compInstance => compInstance._selectFile,
        (compInstance, val) => compInstance._selectFile = val
      );
    }

  constructor(
    private nameDialogService: NameDialogService,
    @Optional() @SkipSelf() public parent: FileTreeComponent,
    public fileTreeService: FileTreeService) {}

  get level () {
    return this.parent ? this.parent.level + 1 : 0;
  }

  private createEventArgs(target: File | Directory) {

    let isFile = instanceOfFile(target);

    let path = isFile ? `${this.getFileTreePath()}/${target.name}` : this.getFileTreePath();

    return {
      target: target,
      parentDirectory: this.directory,
      isFile: isFile,
      isDirectory: !isFile,
      path: path
    }
  }

  isRemovable(file: File) {
    return !this.isMandatoryFile(file);
  }

  isEditable(file: File) {
    return !this.isMandatoryFile(file);
  }

  select(event, file: File) {
    if (instanceOfFile(file)) {
      this.selectFile.emit(this.createEventArgs(file));
    }
  }

  deleteFileOrDirectory(event: Event, fileOrDirectory: File|Directory) {
    this.stopEventPropagation(event);
    deleteFromDirectory(fileOrDirectory, this.directory);
    this.remove.emit(this.createEventArgs(fileOrDirectory));
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
    this.stopEventPropagation(event);
    this.nameDialogService.openEditFileNameDialog(parentDirectory, file)
                          .subscribe(editedFile => this.editFile.emit(this.createEventArgs(editedFile)));
  }

  openAddFileNameDialog(event: Event, parentDirectory: Directory) {
    this.stopEventPropagation(event);
    this.nameDialogService.openAddFileNameDialog(parentDirectory)
                          .subscribe(file => this.addFile.emit(this.createEventArgs(file)));
  }

  private stopEventPropagation(event: Event) {
    if (event) {
      event.stopPropagation();
    }
  }

  private isMandatoryFile(file: File) {
    return this.mandatoryFiles.indexOf(file.name) > -1;
  }

  // This looks more scary than it actually is. We want to return
  // EventEmitters from the top most parent FileTreeComponent. As
  // we need this for multiple Outputs, we genereralize it into
  // a pattern where lookups are DRY yet type safe (e.g no string name passing)
  private lookupOrCreateReturn(propertySelector: EventEmitterSelectorFn,
                               backingFieldSelector: EventEmitterSelectorFn,
                               setter: EventEmitterSetterFn) {
    if (this.parent) {
      return propertySelector(this.parent);
    }

    if (!backingFieldSelector(this)) {
      setter(this, new EventEmitter());
    }

    return backingFieldSelector(this);
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
