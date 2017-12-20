import { Lab, File, instanceOfFile, LabDirectory, Directory } from '@machinelabs/models';
import { readLabDirectory, ReadOptions } from '../io/lab-fs/read';
import { getMlYamlFromLabDirectory } from './read';

export const getMlYamlFromPath = (path: string, options?: ReadOptions) => {
  let dir = readLabDirectory(path, options);
  return getMlYamlFromLabDirectory(dir);
};
