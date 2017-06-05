import { ValidationResult } from 'models/validation-result';
import { ValidationContext } from 'models/validation-context';

export interface ValidationRule {
  check(validationContext: ValidationContext) : ValidationResult
}