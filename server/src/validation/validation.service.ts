import { Observable } from '@reactivex/rxjs';
import { Invocation} from '../models/invocation';
import { ValidationRule } from './rules/rule';
import { ValidationContext } from '../models/validation-context';
import { ExecutionRejectionInfo } from '../models/execution';
import { Resolver } from './resolver/resolver';
import { ValidationResult } from '../models/validation-result';

export class ValidationService {

  private rules: Array<ValidationRule> = [];
  private resolver = new Map<Function, Resolver>();

  addResolver(resolverType:Function , resolver: Resolver) {
    this.resolver.set(resolverType, resolver);
    return this;
  }

  addRule(rule: ValidationRule) {
    this.rules.push(rule);
    return this;
  }

  validate(invocation: Invocation) : Observable<ValidationContext> {

    let resolves = new Map<Function, Observable<any>>();
    let resolved = new Map<Function, any>();

    this.resolver.forEach((val, key) => {
      resolves.set(key, val.resolve(invocation)
                           .do(data => resolved.set(key, data))
                           .share());
    });

    let results$ = Observable
                      .from(this.rules)
                      .flatMap(rule => rule.check(invocation, resolves))
                      .share();

    let fails$ = results$.filter(result => result instanceof ExecutionRejectionInfo);

    return results$.takeUntil(fails$)
            .merge(fails$.take(1))
            .last()
            .map((result: ValidationResult) => new ValidationContext(result, resolved));
  }
}