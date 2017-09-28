import { Injectable } from '@angular/core';
import {
  File,
  Directory,
  instanceOfFile,
  instanceOfDirectory,
  LabDirectory
} from '@machinelabs/core/models/directory';

const findFile = (name: string) => {
  return (fileOrDirectory: File | Directory) => {
    return fileOrDirectory.name === name && instanceOfFile(fileOrDirectory);
  };
};

const findDirectory = (name: string) => {
  return (fileOrDirectory: File | Directory) => {
    return fileOrDirectory.name === name && instanceOfDirectory(fileOrDirectory);
  }
};


@Injectable()
export class FileTreeService {

  constructor() { }

  deleteFromDirectory(fileOrDirectory: File|Directory, directory: Directory) {
    directory.contents.splice(directory.contents.indexOf(fileOrDirectory), 1);
  }

  updateFileInDirectory(file: File, newFile: File, directory: Directory) {
    const index = directory.contents.findIndex(f => f.name === file.name);
    if (index !== -1) {
      directory.contents[index] = newFile;
    }
  }

  getFileFromPath(path: string, directory: LabDirectory): File | null {
    let pathSegments = this.normalizePathSegments(path);
    let currentDirectory = directory;
    let file = null;

    for (let i = 0; i < pathSegments.length; i++) {
      let name = pathSegments[i];
      let lookingForDirectory = i !== pathSegments.length - 1;

      let fileOrDirectory = currentDirectory
          .find(lookingForDirectory ? findDirectory(name) : findFile(name));

      if (!fileOrDirectory) {
        break;
      }

      if (lookingForDirectory) {
        if (instanceOfDirectory(fileOrDirectory)) {
          currentDirectory = fileOrDirectory.contents;
        }
      } else {
        if (instanceOfFile(fileOrDirectory)) {
          file = fileOrDirectory;
        }
      }
    }
    return file;
  }

  private normalizePathSegments(path: string) {
    let segments = path.split('/');
    if (segments[0] === '') {
      segments.splice(0, 1);
    }
    return segments;
  }
}
