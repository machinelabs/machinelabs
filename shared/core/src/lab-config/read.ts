import { Lab, File, instanceOfFile, LabDirectory, Directory } from '@machinelabs/models';
import { readLabDirectory, ReadOptions } from '../io/lab-fs/read';

export const CONFIG_FILE_NAME = 'ml.yaml';

export const getMlYamlFromLabDirectory = (dir: LabDirectory) => {
  let file = dir.find(f => f.name.toLowerCase() === CONFIG_FILE_NAME);

  return instanceOfFile(file) ? file : null;
};

export const getMlYamlFromLab = (lab: Lab) => getMlYamlFromLabDirectory(lab.directory);
