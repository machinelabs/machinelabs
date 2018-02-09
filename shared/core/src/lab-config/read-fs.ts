import { readFileSync } from 'fs';
import { join } from 'path';
import { ML_YAML_FILENAME } from './ml.yaml';

export const getMlYamlFromPath = (path: string) => {
  try {
    let content = readFileSync(join(path, ML_YAML_FILENAME)).toString();

    return {
      name: ML_YAML_FILENAME,
      content
    };
  } catch (error) {
    return null;
  }
};
