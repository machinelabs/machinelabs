import { LabDirectory, File, instanceOfFile } from '@machinelabs/core/models/directory';

const MAIN_PYTHON_FILENAME = 'main.py';

export const isMainFile = (file: File): boolean => file.name === MAIN_PYTHON_FILENAME;

export const getMainFile = (directory: LabDirectory) => {
  return <File>directory.find(fileOrDirectory => {
    return instanceOfFile(fileOrDirectory) && isMainFile(fileOrDirectory);
  });
}
