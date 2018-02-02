import { Lab, File, instanceOfFile, LabDirectory, Directory } from '@machinelabs/models';
import { ML_YAML_FILENAME } from './ml.yaml';

export const getMlYamlFromLabDirectory = (dir: LabDirectory) => {
  let file = dir.find(f => f.name.toLowerCase() === ML_YAML_FILENAME);

  return instanceOfFile(file) ? file : null;
};

export const getMlYamlFromLab = (lab: Lab) => getMlYamlFromLabDirectory(lab.directory);
