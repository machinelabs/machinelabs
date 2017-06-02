import { ValidationRule, allow } from './rule';
import { ExtendedUser } from 'models/user';
import { Invocation } from 'models/invocation';
import { Approval } from 'models/approval';
import { ValidationContext } from 'models/validation-context';

const PLANS = ['admin', 'beta'];

export class HasPlanRule implements ValidationRule {

  check(validationContext: ValidationContext) : Approval {
    return !validationContext.user || !validationContext.user.plan || !PLANS.includes(validationContext.user.plan.plan_id) ? 
      this.rejectUserWithoutPlan() :
      allow();
  }

  private rejectUserWithoutPlan() {
    return {
      message: 'Only invited beta users can execute labs',
      allowExecution: false
    }
  }
}