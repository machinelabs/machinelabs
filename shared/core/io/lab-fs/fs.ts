import { spawnShell, OutputType } from '../reactive-process';
import { Observable } from '@reactivex/rxjs';

import { Directory, LabDirectory, File } from '../../models/directory';
import { createWriteDirectoryCmd, createWriteLabDirectoryCmd } from './fs-commands';


export const writeDirectory = (directory: Directory, skipRoot?: boolean) => {
  return spawnShell(createWriteDirectoryCmd(directory, skipRoot));
};

export const writeLabDirectory = (labDirectory: LabDirectory) => {
  return spawnShell(createWriteLabDirectoryCmd(labDirectory));
};

