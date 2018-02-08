import { readFileSync } from 'fs';
import { join } from 'path';
import { ML_YAML_FILENAME } from './ml.yaml';

export const getMlYamlFromPath = (path: string) => {

  let content = readFileSync(join(path, ML_YAML_FILENAME)).toString();
  return {
    content: content,
    name: ML_YAML_FILENAME
  };
};
