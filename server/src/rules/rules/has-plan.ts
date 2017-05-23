import { ExecutionRule, allow } from './rule';
import { ExtendedUser } from 'models/user';
import { Invocation } from 'models/invocation';
import { Approval } from 'models/approval';

const PLANS = ['admin', 'beta'];

export class HasPlanRule implements ExecutionRule {

  check(invocation: Invocation, user: ExtendedUser) : Approval {
    return !user || !user.plan || !PLANS.includes(user.plan.plan_id) ? 
      this.rejectUserWithoutPlan(invocation) :
      allow(invocation);
  }

  private rejectUserWithoutPlan(invocation: Invocation) {
    return {
      invocation: invocation,
      message: 'Only invited beta users can execute labs',
      allowExecution: false
    }
  }
}