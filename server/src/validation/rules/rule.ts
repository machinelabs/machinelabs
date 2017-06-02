import { Approval } from 'models/approval';
import { ValidationContext } from 'models/validation-context';

export interface ValidationRule {
  check(validationContext: ValidationContext) : Approval
}

export function allow(): Approval {
  return {
    message: 'ok',
    allowExecution: true,
  }
}