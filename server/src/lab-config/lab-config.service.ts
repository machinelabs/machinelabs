import { Lab } from '@machinelabs/core';
import { PublicLabConfiguration, InternalLabConfiguration, ScriptParameter } from '../models/lab-configuration';
import { safeLoad} from 'js-yaml';
import isString = require('lodash.isstring');
import isObject = require('lodash.isobject');

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
      return this.isValidPublicConfig(actualConfig) ? actualConfig : null;
    } catch (error) {
      return null;
    }
  }

  private getMlYaml(lab: Lab) {
    let file = lab.directory
                  .find(currentFile => currentFile.name.toLowerCase() === CONFIG_FILE_NAME);
    return file;
  }

  public isValidPublicConfig(config: PublicLabConfiguration) {
    // The dockerImageId is the only mandatory property on the public config
    return !!config.dockerImageId;
  }

  public isValidInternalConfig(config: InternalLabConfiguration) {
    return isString(config.imageWithDigest) && config.imageWithDigest.length > 0 &&
      Array.isArray(config.inputs) && this.hasValidParameters(config);
  }

  private hasValidParameters(config: InternalLabConfiguration) {
    return Array.isArray(config.parameters) &&
      config.parameters.every(param => isObject(param) && !!param['pass-as']);
  }
}
