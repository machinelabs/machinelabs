import { readdirSync, statSync, readFileSync } from 'fs';
import { basename, extname, join, dirname } from 'path';
import * as globby from 'globby';

import { File, Directory, LabDirectory, instanceOfDirectory } from '@machinelabs/models';

const isBinaryFile = require('isbinaryfile').sync;


export interface ReadOptions {
  extensions?: RegExp;
  exclude?: string[];
  excludeBinaries?: boolean;
}

const createDirectoryStructure = (path: string, directories: Map<string, Directory>) => {
  if (directories.has(path)) {
    // Early exit if the directory is already present
    return;
  }

  const dirs = path.split('/');
  let result: Directory;

  while (dirs.length > 0) {
    const dirPath = join(...dirs);
    const dir = dirs.pop();

    const directory = directories.get(dirPath);

    if (directory) {
      directory.contents.push(result);

      return;
    } else {
      result = {
        name: dir,
        contents: result ? [result] : []
      };

      directories.set(dirPath, result);
    }
  }

  return result;
};

export const readDirectory = (path: string, options: ReadOptions = {}): Directory => {
  const excludePatterns = Array.isArray(options.exclude) ? options.exclude : [];

  const files = globby.sync(['**/*'], {
    cwd: path,
    ignore: excludePatterns,
    dot: true
  });

  const result: (Directory | File)[] = [];
  const directories = new Map<string, Directory>();

  for (const file of files) {
    // Extract the filename, extension and directory name out of the path
    const filename = basename(file);
    const extension = extname(filename).toLowerCase();
    const directoryName = dirname(file);

    // Skip if it does not match the extension regex or it is a binary file
    if (options &&
      (options.extensions && !options.extensions.test(extension) ||
      (options.excludeBinaries && isBinaryFile(path)))) {
      continue;
    }

    if (directoryName === '.') {
      // If the directory is the root directory, just push the file into the result
      result.push({
        name: filename,
        content: readFileSync(join(path, file)).toString()
      });
    } else {
      // Create the entire directory structure and keep track of individual directories
      const structure = createDirectoryStructure(directoryName, directories);

      if (structure) {
        // If a structure is returned, it is a new structure and we should add it to the result
        result.push(structure);
      }

      // Push the file into the correct directory
      const directory = directories.get(directoryName);
      directory.contents.push({
        name: filename,
        content: readFileSync(join(path, file)).toString()
      });
    }
  }

  return {
    name: '.',
    contents: result
  };
};

export const readLabDirectory = (path: string, options?: ReadOptions): LabDirectory => {
  let dir = readDirectory(path, options);

  if (instanceOfDirectory(dir)) {
    return dir.contents;
  }

  return null;
};
