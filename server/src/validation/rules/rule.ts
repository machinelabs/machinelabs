import { Observable } from 'rxjs';
import { ValidationResult } from '../validation-result';
import { Invocation } from '@machinelabs/models';

export interface ValidationRule {
  check(validationContext: Invocation, resolves: Map<Function, Observable<any>>): Observable<ValidationResult>;
}
