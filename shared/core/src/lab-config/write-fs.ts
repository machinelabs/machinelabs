import { writeFileSync } from 'fs';
import { join } from 'path';
import { ML_YAML_FILENAME } from './ml.yaml';

export const writeMlYamlToPath = (path: string, data: string) => {
  try {
    writeFileSync(join(path, ML_YAML_FILENAME), data);
  } catch (error) {
    console.log(`Could not write ${ML_YAML_FILENAME} to file system.`);
  }
};
