import { ValidationRule } from './rule';
import { ExtendedUser } from '../../models/user';
import { Invocation } from '../../models/invocation';
import { ValidationResult } from '../../models/validation-result';
import { DockerImageService } from '../../docker-image.service';
import { ValidationContext } from '../../models/validation-context';
import { PublicLabConfiguration } from '../../models/lab-configuration';
import { LabConfigService } from '../../lab-config/lab-config.service';
import { ExecutionRejectionInfo, ExecutionRejectionReason } from '../../models/execution';

export class HasValidConfigRule implements ValidationRule {

  constructor(private dockerImageService: DockerImageService,
              private labConfigService: LabConfigService) {
  }

  check(validationContext: ValidationContext): ValidationResult {
    
    let config = this.labConfigService.readConfig(validationContext.invocation.data);
    if (config) {
      validationContext.labConfiguration.imageWithDigest = this.dockerImageService.getImageNameWithDigest(config.dockerImageId);

      if (validationContext.labConfiguration.imageWithDigest){
        return true;
      }
    }

    return new ExecutionRejectionInfo(ExecutionRejectionReason.InvalidConfig, 'Config (ml.yaml) is invalid');
  }
}
