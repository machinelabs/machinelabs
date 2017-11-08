import { safeLoad} from 'js-yaml';
import { Lab } from '../../models/lab';
import { instanceOfFile, Directory, File, LabDirectory } from '../../models/directory';
import { Invocation } from '../../models/invocation';

export const parseLabConfig = (configFile: File) => {
  try {
    return safeLoad(configFile.content);
  } catch (error) {
    return null;
  }
};


export const getMlYaml = (labDirectory: LabDirectory) => {
  let file = labDirectory
                .find(currentFile => currentFile.name.toLowerCase() === 'ml.yaml');

  return instanceOfFile(file) ? file : null;
};

export const readLabConfig = (invocation: Invocation) => {
  let labDirectory = JSON.parse(invocation.data.directory);

  if (!labDirectory) {
    return null;
  }

  let mlYaml = getMlYaml(labDirectory);

  if (!mlYaml) {
    return null;
  }

  let config = parseLabConfig(mlYaml);

  return config || null;
};

