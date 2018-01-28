import { writeFileSync, mkdirSync, existsSync } from 'fs';
import { spawnShell, OutputType } from '../reactive-process';
import { Observable } from 'rxjs/Observable';
import { defer } from 'rxjs/observable/defer';
import { _throw } from 'rxjs/observable/throw';
import { of } from 'rxjs/observable/of';

import { Directory, LabDirectory, File, instanceOfFile, instanceOfDirectory } from '@machinelabs/models';
import { createWriteDirectoryCmd, createWriteLabDirectoryCmd } from './fs-commands';

export const writeDirectory = (directory: Directory, skipRoot?: boolean) => {
  if (!skipRoot && !directory.name) {
    return defer(() => _throw('Root directory has no name.'));
  }

  directory.name = skipRoot ? '' : directory.name;
  return defer(() => of(writeFileOrDirectorySync(directory, skipRoot)));
};

export const writeDirectoryInShell = (directory: Directory, skipRoot?: boolean) => {
  return spawnShell(createWriteDirectoryCmd(directory, skipRoot));
};

export const writeLabDirectory = (labDirectory: LabDirectory) => {
  return spawnShell(createWriteLabDirectoryCmd(labDirectory));
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
