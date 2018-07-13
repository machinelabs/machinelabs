import { writeFileSync, mkdirSync, existsSync } from 'fs';
import { spawnShell, OutputType } from '../reactive-process';
import { Observable, defer, throwError, of } from 'rxjs';

import { Directory, LabDirectory, File, instanceOfFile, instanceOfDirectory } from '@machinelabs/models';

export const writeDirectory = (directory: Directory, skipRoot?: boolean) => {
  if (!skipRoot && !directory.name) {
    return defer(() => throwError('Root directory has no name.'));
  }

  directory.name = skipRoot ? '' : directory.name;
  return defer(() => of(writeFileOrDirectorySync(directory, skipRoot)));
};

const writeFileOrDirectorySync = (fileOrDirectory: File | Directory, skipRoot = false, path = '') => {
  path += path.length ? '/' + fileOrDirectory.name : fileOrDirectory.name;

  if (instanceOfDirectory(fileOrDirectory)) {
    if (!skipRoot && !existsSync(path)) {
      mkdirSync(path);
    }

    fileOrDirectory.contents.forEach(content => writeFileOrDirectorySync(content, false, path));
  } else if (instanceOfFile(fileOrDirectory)) {
    writeFileSync(path, fileOrDirectory.content);
  }
};
