import { Directory, LabDirectory, File, instanceOfFile, instanceOfDirectory } from '@machinelabs/models';

const findFile = (name: string) => {
  return (fileOrDirectory: File | Directory) => {
    return fileOrDirectory.name === name && instanceOfFile(fileOrDirectory);
  };
};

const findDirectory = (name: string) => {
  return (fileOrDirectory: File | Directory) => {
    return fileOrDirectory.name === name && instanceOfDirectory(fileOrDirectory);
  };
};

export const normalizePathSegments = (path: string) => {
  let segments = path.split('/');
  if (segments[0] === '') {
    segments.splice(0, 1);
  }
  return segments;
};

export const getFileFromPath = (path: string, directory: LabDirectory) => {
  let pathSegments = normalizePathSegments(path);
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
};
