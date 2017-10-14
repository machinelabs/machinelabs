import { Directory, File } from '@machinelabs/models';

export const deleteFromDirectory = (fileOrDirectory: File|Directory, directory: Directory) => {
  directory.contents.splice(directory.contents.indexOf(fileOrDirectory), 1);
};

export const updateFileInDirectory = (file: File, newFile: File, directory: Directory) => {
  const index = directory.contents.findIndex(f => f.name === file.name);
  if (index !== -1) {
    directory.contents[index] = newFile;
  }
};
