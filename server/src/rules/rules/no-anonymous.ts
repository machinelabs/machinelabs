import { ExecutionRule, allow } from './rule';
import { ExtendedUser } from 'models/user';
import { Invocation } from 'models/invocation';
import { Approval } from 'models/approval';

export class NoAnonymousRule implements ExecutionRule {

  check(invocation: Invocation, user: ExtendedUser) : Approval {
    return !user || user.common.isAnonymous ? 
      this.rejectAnonymous(invocation) :
      allow(invocation);
  }

  private rejectAnonymous(invocation: Invocation) {
    return {
      invocation: invocation,
      message: 'Anonymous user can only replay existing executions',
      allowExecution: false
    }
  }
}