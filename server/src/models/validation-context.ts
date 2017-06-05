import { Invocation } from './invocation';
import { PrivateLabConfiguration } from './lab-configuration';
import { ValidationResult } from './validation-result';
import { ExtendedUser } from './user';

export class ValidationContext {
  readonly invocation: Invocation;
  readonly labConfiguration: PrivateLabConfiguration;
  readonly user: ExtendedUser;
  validationResult: ValidationResult;

  constructor(invocation: Invocation, user: ExtendedUser) {
    this.labConfiguration = new PrivateLabConfiguration();
    this.invocation = invocation;
    this.user = user;
  }

  isApproved() {
    return !!this.validationResult;
  }

}