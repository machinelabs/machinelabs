import { Observable } from '@reactivex/rxjs';
import { Resolver } from './resolver';
import { Invocation } from '../../models/invocation';
import { DockerImageService } from '../../docker-image.service';
import { PublicLabConfiguration } from '../../models/lab-configuration';
import { LabConfigService } from '../../lab-config/lab-config.service';


export class LabConfigResolver implements Resolver {

  constructor(private dockerImageService: DockerImageService,
              private labConfigService: LabConfigService) {
  }

  resolve(invocation: Invocation) {

    let config = this.labConfigService.readConfig(invocation.data);
    if (config) {
      config.imageWithDigest = this.dockerImageService.getImageNameWithDigest(config.dockerImageId);
    }

    return Observable.of(config);
  }
}
