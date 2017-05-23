import { Approval } from 'models/approval';
import { Invocation } from 'models/invocation';
import { ExtendedUser } from 'models/user';

export interface ExecutionRule {
  check(invocation: Invocation, user: ExtendedUser) : Approval
}

export function allow(invocation: Invocation): Approval {
  return {
    invocation: invocation,
    message: 'ok',
    allowExecution: true,
  }
}