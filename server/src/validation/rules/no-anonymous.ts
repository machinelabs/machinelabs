import { ValidationRule, allow } from './rule';
import { ExtendedUser } from 'models/user';
import { Invocation } from 'models/invocation';
import { Approval } from 'models/approval';
import { ValidationContext } from 'models/validation-context';

export class NoAnonymousRule implements ValidationRule {

  check(validationContext: ValidationContext) : Approval {
    return !validationContext.user || validationContext.user.common.isAnonymous ? 
      this.rejectAnonymous() :
      allow();
  }

  private rejectAnonymous() {
    return {
      message: 'Anonymous user can only replay existing executions',
      allowExecution: false
    }
  }
}