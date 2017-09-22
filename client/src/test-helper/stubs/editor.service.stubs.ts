import { LAB_STUB } from './lab.stubs';
import { File, Directory, LabDirectory } from '@machinelabs/core/models/directory';

export const EDITOR_SERVICE_STUB = {
  lab: Object.assign({}, LAB_STUB),
  openFile: (file: File) => {},
  deleteFileFromDirectory: (file: File, directory: Directory) => {
    directory.contents.splice(directory.contents.indexOf(file), 1);
  },
  updateFileInDirectory: (file: File, newFile: File, directory: Directory) => {
    const index = directory.contents.findIndex(f => f.name === file.name);
    if (index !== -1) {
      directory.contents[index] = newFile;
    }
  }
}
