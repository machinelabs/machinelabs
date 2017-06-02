import { Invocation } from './invocation';
import { PrivateLabConfiguration } from './lab-configuration';
import { Approval } from './approval';
import { ExtendedUser } from './user';

export class ValidationContext {
  readonly invocation: Invocation;
  readonly labConfiguration: PrivateLabConfiguration;
  readonly approval: Approval;
  readonly user: ExtendedUser;

  constructor(invocation: Invocation, user: ExtendedUser) {
    this.labConfiguration = new PrivateLabConfiguration();
    this.approval = {
      allowExecution: false,
      message: ''
    };
    this.invocation = invocation;
    this.user = user;
  }

  isApproved() {
    return this.approval && this.approval.allowExecution;
  }
}