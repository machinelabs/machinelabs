import { safeLoad } from 'js-yaml';
import { File, LabConfig } from '@machinelabs/models';

export const parseMlYaml = (configFile: File): LabConfig | null => {
  try {
    return safeLoad(configFile.content);
  } catch (error) {
    return null;
  }
};
