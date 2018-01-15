import { safeLoad} from 'js-yaml';
import { File } from '@machinelabs/models';

export const parseMlYaml = (configFile: File) => {
  try {
    return safeLoad(configFile.content);
  } catch (error) {
    return null;
  }
};


