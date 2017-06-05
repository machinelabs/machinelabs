import { ValidationRule } from './rule';
import { ExtendedUser } from '../../models/user';
import { Invocation } from '../../models/invocation';
import { ValidationResult } from '../../models/validation-result';
import { ValidationContext } from '../../models/validation-context';
import { ExecutionRejectionInfo, ExecutionRejectionReason } from '../../models/execution';

const PLANS = ['admin', 'beta'];

export class HasPlanRule implements ValidationRule {

  check(validationContext: ValidationContext) : ValidationResult {
    return !validationContext.user || !validationContext.user.plan || !PLANS.includes(validationContext.user.plan.plan_id) ? 
      new ExecutionRejectionInfo(ExecutionRejectionReason.NoPlan, 'Missing plan that allows executions') :
      true;
  }
}