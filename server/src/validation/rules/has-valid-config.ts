import { ValidationRule, allow } from './rule';
import { ExtendedUser } from '../../models/user';
import { Invocation } from '../../models/invocation';
import { Approval } from '../../models/approval';
import { DockerImageService } from '../../docker-image.service';
import { ValidationContext } from '../../models/validation-context';
import { PublicLabConfiguration } from '../../models/lab-configuration';

export class HasValidConfigRule implements ValidationRule {

  constructor(private dockerImageService: DockerImageService) {
  }

  check(validationContext: ValidationContext): Approval {
    
    let config = this.parseMlYaml();
    validationContext.labConfiguration.imageWithDigest = this.dockerImageService.getImageNameWithDigest(config.dockerImageId);

    if (!validationContext.labConfiguration.imageWithDigest){
      return this.rejectInvalidConfig();
    }

    return allow();
  }

  private parseMlYaml() {
    return new PublicLabConfiguration();
  }

  private rejectInvalidConfig() {
    return {
      message: 'Image does not exist',
      allowExecution: false
    }
  }
}