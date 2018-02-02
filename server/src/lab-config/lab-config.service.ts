import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import { map, tap } from 'rxjs/operators';
import { Lab, File, instanceOfFile, MountOption, HardwareType } from '@machinelabs/models';
import { PublicLabConfiguration, InternalLabConfiguration, ScriptParameter } from '../models/lab-configuration';
import { getMlYamlFromLab, parseMlYaml } from '@machinelabs/core';

import { safeLoad} from 'js-yaml';
import isString = require('lodash.isstring');
import isObject = require('lodash.isobject');
import { DockerImageService } from '../docker-image.service';
import { MountService } from '../mounts/mount.service';
import { mute } from '../rx/mute';

export class LabConfigService {

  constructor(private dockerImageService: DockerImageService,
              private mountService: MountService) {}

  readPublicConfig(lab: Lab): PublicLabConfiguration {

    let configFile = getMlYamlFromLab(lab);

    let parsed = parseMlYaml(configFile);

    if (!parsed) {
      return null;
    }

    return Object.assign(new PublicLabConfiguration(), parsed);
  }

  getInternalConfig(userId: string, lab: Lab) {
    return this.toInternalConfig(userId, this.readPublicConfig(lab));
  }

  toInternalConfig(userId: string, publicConfig: PublicLabConfiguration) {
    let config = new InternalLabConfiguration();

    if (!publicConfig) {
      config.errors.push('Could not parse file');
      return of(config);
    }

    config.inputs = publicConfig.inputs;
    config.parameters = publicConfig.parameters;
    config.imageWithDigest = this.dockerImageService.getImageNameWithDigest(publicConfig.dockerImageId);

    if (isString(publicConfig.hardwareType)) {
      let specifiedHardwareType = publicConfig.hardwareType.toLowerCase();
      if (Object.values(HardwareType).includes(specifiedHardwareType)) {
        config.hardwareType = <HardwareType>publicConfig.hardwareType.toLowerCase();
      } else {
        config.errors.push('Invalid hardwareType');
      }
    }

    return this.mountService.validateMounts(userId, publicConfig.mounts)
      .pipe(
        tap(validated => config.errors.push(...validated.errors)),
        tap(validated => config.mountPoints = validated.mountPoints),
        map(_ => config),
        map(this.reportError('Invalid parameters', this.hasValidParameters)),
        map(this.reportError('Unknown dockerImageId', this.isValidImage)),
        map(this.reportError('Invalid inputs', this.hasValidInputs))
      );
  }

  private reportError(error: string, validate: (config: InternalLabConfiguration) => boolean) {
    return (config: InternalLabConfiguration) => {
      let valid = validate(config);

      if (!valid) {
        config.errors.push(error);
      }

      return config;
    };
  }

  private hasValidInputs(config: InternalLabConfiguration) {
    return Array.isArray(config.inputs) && config.inputs.every(param => isObject(param) && !!param['name'] && !!param['url']);
  }

  private isValidImage(config: InternalLabConfiguration) {
    return isString(config.imageWithDigest) && config.imageWithDigest.length > 0;
  }

  private hasValidParameters(config: InternalLabConfiguration) {
    return Array.isArray(config.parameters) && config.parameters.every(param => isObject(param) && !!param['pass-as']);
  }

}
