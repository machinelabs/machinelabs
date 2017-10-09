import { instanceOfFile } from '@machinelabs/core/models/directory';
import { Lab } from '../models/lab';
import { PublicLabConfiguration } from '../models/lab-configuration';
import { safeLoad } from 'js-yaml';

export const CONFIG_FILE_NAME = 'ml.yaml';

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
                  .find(f => f.name.toLowerCase() === CONFIG_FILE_NAME);

    return file && instanceOfFile(file) ? file : null;
  }

  private isValidConfig(config: PublicLabConfiguration) {
    return !!config.dockerImageId;
  }
}

