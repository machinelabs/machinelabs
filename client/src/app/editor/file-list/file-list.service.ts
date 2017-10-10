import { Injectable } from '@angular/core';

import {
  File,
  Directory,
  instanceOfDirectory,
  DirectoryClientState,
  LabDirectory,
  isLabDirectory
} from '@machinelabs/core/models/directory';

@Injectable()
export class FileListService {

  collapseDirectory(fileOrDirectory: File | Directory) {
    this.setCollapsed(fileOrDirectory, true);
  }

  expandDirectory(fileOrDirectory: File | Directory) {
    this.setCollapsed(fileOrDirectory, false);
  }

  collapseAll(fileOrDirectory: File | Directory | LabDirectory) {
    if (isLabDirectory(fileOrDirectory)) {
      return fileOrDirectory.map(child => this.collapseAll(child));
    }

    this.collapseDirectory(fileOrDirectory);

    if (instanceOfDirectory(fileOrDirectory) && fileOrDirectory.contents) {
      return fileOrDirectory.contents.map(child => this.collapseAll(child));
    }
  }

  selectFile(fileOrDirectory: File | Directory) {
    this.setSelected(fileOrDirectory, true);
  }

  unselectFile(fileOrDirectory: File | Directory) {
    this.setSelected(fileOrDirectory, false);
  }

  private setCollapsed(fileOrDirectory: File | Directory, value: boolean) {
    if (fileOrDirectory) {
      fileOrDirectory.clientState = this.updateClientState(fileOrDirectory.clientState, { collapsed: value });
    }
  }

  private setSelected(fileOrDirectory: File | Directory, value: boolean) {
    if (fileOrDirectory) {
      fileOrDirectory.clientState = this.updateClientState(fileOrDirectory.clientState, { selected: value });
    }
  }

  private updateClientState(clientState: DirectoryClientState, newState: DirectoryClientState) {
    return { ...clientState, ...newState };
  }

}
