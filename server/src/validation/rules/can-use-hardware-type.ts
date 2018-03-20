import { Observable } from 'rxjs/Observable';
import { forkJoin } from 'rxjs/observable/forkJoin';
import { map } from 'rxjs/operators';
import { ValidationRule } from './rule';
import {
  Invocation,
  HardwareType,
  ExecutionRejectionInfo,
  ExecutionRejectionReason,
  PlanId
} from '@machinelabs/models';
import { ValidationResult } from '../validation-result';
import { LabConfigResolver } from '../resolver/lab-config-resolver';
import { UserResolver } from '../resolver/user-resolver';

export class CanUseHardwareType implements ValidationRule {
  check(validationContext: Invocation, resolves: Map<Function, Observable<any>>): Observable<ValidationResult> {
    if (!resolves.has(LabConfigResolver)) {
      throw new Error('Missing resolver: LabConfigResolver');
    }

    if (!resolves.has(UserResolver)) {
      throw new Error('Missing resolver: UserResolver');
    }

    return forkJoin(resolves.get(UserResolver), resolves.get(LabConfigResolver)).pipe(
      map(([user, config]) => {
        const isAdminOrBacker = [PlanId.Admin, PlanId.BetaBacker].includes(user.plan.plan_id);

        const reject = config.hardwareType === HardwareType.GPU && !isAdminOrBacker;

        if (reject) {
          return new ExecutionRejectionInfo(
            ExecutionRejectionReason.HardwareTypeNotPermitted,
            `Plan does not allow GPU usage`
          );
        }

        return true;
      })
    );
  }
}
