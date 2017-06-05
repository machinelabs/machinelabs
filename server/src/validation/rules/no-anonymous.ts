import { ValidationRule } from './rule';
import { ExtendedUser } from '../../models/user';
import { Invocation } from '../../models/invocation';
import { ValidationResult } from '../../models/validation-result';
import { ValidationContext } from '../../models/validation-context';
import { ExecutionRejectionReason, ExecutionRejectionInfo } from '../../models/execution';

export class NoAnonymousRule implements ValidationRule {

  check(validationContext: ValidationContext) : ValidationResult {
    return !validationContext.user || validationContext.user.common.isAnonymous ? 
      new ExecutionRejectionInfo(ExecutionRejectionReason.NoAnonymous, 'Anonymous user can not execute code') :
      true;
  }
}