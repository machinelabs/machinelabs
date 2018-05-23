import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ValidationRule } from './rule';
import { Invocation, ExecutionRejectionInfo, ExecutionRejectionReason } from '@machinelabs/models';
import { ValidationResult } from '../validation-result';
import { InternalLabConfiguration } from '../../models/lab-configuration';
import { LabConfigService } from '../../lab-config/lab-config.service';
import { LabConfigResolver } from '../resolver/lab-config-resolver';

export class HasValidConfigRule implements ValidationRule {
  constructor(private labConfigService: LabConfigService) {}

  check(validationContext: Invocation, resolves: Map<Function, Observable<any>>): Observable<ValidationResult> {
    if (!resolves.has(LabConfigResolver)) {
      throw new Error('Missing resolver: LabConfigResolver');
    }

    return resolves.get(LabConfigResolver).pipe(
      map((config: InternalLabConfiguration) => {
        if (config.errors.length > 0) {
          return new ExecutionRejectionInfo(ExecutionRejectionReason.InvalidConfig, config.errors[0]);
        }

        return true;
      })
    );
  }
}
