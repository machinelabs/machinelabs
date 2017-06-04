import { ValidationRule, allow } from './rule';
import { ExtendedUser } from '../../models/user';
import { Invocation } from '../../models/invocation';
import { Approval } from '../../models/approval';
import { DockerImageService } from '../../docker-image.service';
import { ValidationContext } from '../../models/validation-context';
import { PublicLabConfiguration } from '../../models/lab-configuration';
import { LabConfigService } from '../../lab-config/lab-config.service';

export class HasValidConfigRule implements ValidationRule {

  constructor(private dockerImageService: DockerImageService,
              private labConfigService: LabConfigService) {
  }

  check(validationContext: ValidationContext): Approval {
    
    let config = this.labConfigService.readConfig(validationContext.invocation.data);
    if (config) {
      validationContext.labConfiguration.imageWithDigest = this.dockerImageService.getImageNameWithDigest(config.dockerImageId);
    }

    if (!validationContext.labConfiguration.imageWithDigest){
      return this.rejectInvalidConfig();
    }

    return allow();
  }

  private rejectInvalidConfig() {
    return {
      message: 'Image does not exist',
      allowExecution: false
    }
  }
}
