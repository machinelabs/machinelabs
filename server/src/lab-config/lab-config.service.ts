import { Lab } from '@machinelabs/core';
import { PublicLabConfiguration } from '../models/lab-configuration';
import { safeLoad} from 'js-yaml';

const CONFIG_FILE_NAME = 'ml.yaml';

export class LabConfigService {
  readConfig(lab: Lab) {

    let configFile = this.getMlYaml(lab);

    if (!configFile || !configFile.content) {
      return null;
    }

    try {
      let config = safeLoad(configFile.content);

      let actualConfig = Object.assign(new PublicLabConfiguration(), config);
      return this.isValidConfig(actualConfig) ? actualConfig : null;
    } catch (error) {
      return null;
    }
  }

  private getMlYaml(lab: Lab) {
    let file = lab.directory
                  .find(currentFile => currentFile.name.toLowerCase() === CONFIG_FILE_NAME);
    return file;
  }

  private isValidConfig(config: PublicLabConfiguration) {
    return !!config.dockerImageId;
  }
}
