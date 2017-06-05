import { Observable } from '@reactivex/rxjs'
import { ValidationRule } from './rule';
import { ExtendedUser } from '../../models/user';
import { Invocation } from '../../models/invocation';
import { ValidationResult } from '../../models/validation-result';
import { DockerImageService } from '../../docker-image.service';
import { PublicLabConfiguration } from '../../models/lab-configuration';
import { LabConfigService } from '../../lab-config/lab-config.service';
import { ExecutionRejectionInfo, ExecutionRejectionReason } from '../../models/execution';
import { LabConfigResolver } from '../resolver/lab-config-resolver';

export class HasValidConfigRule implements ValidationRule {

  check(validationContext: Invocation, resolves: Map<Function, Observable<any>>): Observable<ValidationResult> {

    if (!resolves.has(LabConfigResolver)) {
      throw new Error('Missing resoler: LabConfigResolver');
    }

    return resolves
      .get(LabConfigResolver)
      .map(config => !config || !config.imageWithDigest ?
        new ExecutionRejectionInfo(ExecutionRejectionReason.InvalidConfig, 'Config (ml.yaml) is invalid') :
        true);
  }
}
