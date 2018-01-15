import { readdirSync, statSync, readFileSync } from 'fs';
import { basename, extname, join } from 'path';

import { File, Directory, LabDirectory, instanceOfDirectory } from '@machinelabs/models';
const isBinaryFile = require('isbinaryfile').sync;

export interface ReadOptions {
  extensions: RegExp;
  exclude: RegExp;
  excludeBinaries: boolean;
}

const safeReadDirSync = (path: string) => {
  let dirData = [];
  try {
    dirData = readdirSync(path);
  } catch (ex) {
    if (ex.code == 'EACCES') {
      // User does not have permissions, ignore directory
      return null;
    }

    throw ex;
  }
  return dirData;
};

export const readDirectory = (path: string, options?: ReadOptions): Directory|File => {
  const name = basename(path);
  let stats;

  try {
    stats = statSync(path);
  } catch (e) {
    return null;
  }

  // Skip if it matches the exclude regex
  if (options && options.exclude && options.exclude.test(path)) {
    return null;
  }

  if (stats.isFile()) {

    const ext = extname(path).toLowerCase();

    let item: File = {
      name: name,
      content: readFileSync(path).toString()
    };

    // Skip if it does not match the extension regex
    if (options &&
      (options.extensions && !options.extensions.test(ext) ||
      (options.excludeBinaries && isBinaryFile(path)))) {
      return null;
    }

    return item;
  } else if (stats.isDirectory()) {

    let dirData = safeReadDirSync(path);
    if (dirData === null) {
      return null;
    }

    let contents = dirData
      .map(child => readDirectory(join(path, child), options))
      .filter(val => !!val);

    return {
      name: name,
      contents: contents
    };
  }

  return null;
};

export const readLabDirectory = (path: string, options?: any): LabDirectory => {
  let dir = readDirectory(path, options);

  if (instanceOfDirectory(dir)) {
    return dir.contents;
  }

  return null;
};
