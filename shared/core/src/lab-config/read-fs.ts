import { readFileSync } from 'fs';
import { join } from 'path';

const ML_YAML_NAME = 'ml.yaml';

export const getMlYamlFromPath = (path: string) => {

  let content = readFileSync(join(path, ML_YAML_NAME)).toString();
  return {
    content: content,
    name: ML_YAML_NAME
  };
};
