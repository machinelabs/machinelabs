import { Observable } from '@reactivex/rxjs';
import { ValidationResult } from '../validation-result';
import { Invocation } from '../../models/invocation';

export interface ValidationRule {
  check(validationContext: Invocation, resolves: Map<Function, Observable<any>>) : Observable<ValidationResult>
}