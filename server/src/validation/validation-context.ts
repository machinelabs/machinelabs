import { ValidationResult } from './validation-result';

export class ValidationContext {
  constructor(public readonly validationResult: ValidationResult,
              public readonly resolved: Map<Function, any>) {
  }

  isApproved() {
    return this.validationResult === true;
  }

}
