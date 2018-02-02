import { spawnShell, OutputType } from '../reactive-process';
import { Observable } from 'rxjs/Observable';

import { Directory, LabDirectory, File } from '@machinelabs/models';
import { createWriteDirectoryCmd, createWriteLabDirectoryCmd } from './fs-commands';


export const writeDirectory = (directory: Directory, skipRoot?: boolean) => {
  return spawnShell(createWriteDirectoryCmd(directory, skipRoot));
};

export const writeLabDirectory = (labDirectory: LabDirectory) => {
  return spawnShell(createWriteLabDirectoryCmd(labDirectory));
};

