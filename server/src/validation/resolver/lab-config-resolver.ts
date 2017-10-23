import { Observable } from '@reactivex/rxjs';
import { Resolver } from './resolver';
import { Invocation } from '../../models/invocation';
import { DockerImageService } from '../../docker-image.service';
import { PublicLabConfiguration, InternalLabConfiguration, MountPoint } from '../../models/lab-configuration';
import { LabConfigService } from '../../lab-config/lab-config.service';
import { MountService, ValidatedMount } from '../../mounts/mount.service';
import { Dataset, MountOption } from '@machinelabs/models';
import * as validFilename from 'valid-filename';
import { mute } from '../../rx/mute';

export class LabConfigResolver implements Resolver {

  constructor(private dockerImageService: DockerImageService,
              private mountService: MountService,
              private labConfigService: LabConfigService) {
  }

  resolve(invocation: Invocation) {

    let publicConfig = this.labConfigService.readConfig(invocation.data);
    let internalConfig = Object.assign(new InternalLabConfiguration(), publicConfig);

    // Run transformations to turn public config into internal config
    if (publicConfig) {

      internalConfig.imageWithDigest = this.dockerImageService.getImageNameWithDigest(publicConfig.dockerImageId);

      return this.mountService.validateMounts(invocation.user_id, publicConfig.mounts)
          .do(validatedMounts => internalConfig.mountPoints = this.mountService.extractValidMountPoints(validatedMounts))
          .do(validatedMounts => internalConfig.errors.push(...this.mountService.extractErrors(validatedMounts)))
          .let(mute).concat(Observable.of(internalConfig));
    }

    return Observable.of(null);
  }

}
