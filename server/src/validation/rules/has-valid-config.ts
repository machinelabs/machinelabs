import { Observable } from '@reactivex/rxjs';
import { ValidationRule } from './rule';
import { Invocation } from '@machinelabs/models';
import { ValidationResult } from '../validation-result';
import { InternalLabConfiguration } from '../../models/lab-configuration';
import { LabConfigService } from '../../lab-config/lab-config.service';
import { ExecutionRejectionInfo, ExecutionRejectionReason } from '../../models/execution';
import { LabConfigResolver } from '../resolver/lab-config-resolver';

export class HasValidConfigRule implements ValidationRule {

  constructor (private labConfigService: LabConfigService) {}

  check(validationContext: Invocation, resolves: Map<Function, Observable<any>>): Observable<ValidationResult> {

    if (!resolves.has(LabConfigResolver)) {
      throw new Error('Missing resolver: LabConfigResolver');
    }

    return resolves
      .get(LabConfigResolver)
      .map((config: InternalLabConfiguration) => {

        if (config.errors.length > 0) {
          return new ExecutionRejectionInfo(ExecutionRejectionReason.InvalidConfig, config.errors[0]);
        }

        return true;
      });
  }
}
