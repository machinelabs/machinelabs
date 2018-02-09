import { safeDump } from 'js-yaml';
import { File } from '@machinelabs/models';
import { ML_YAML_FILENAME } from './ml.yaml';

export const writeMlYaml = (content: any) => {
  try {
    return safeDump(content);
  } catch (error) {
    console.log(`Could not dump content to YAML.`);
  }
};
