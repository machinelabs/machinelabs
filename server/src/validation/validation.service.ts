import { Observable } from 'rxjs/Observable';
import { from } from 'rxjs/observable/from';
import { tap, share, filter, mergeMap, takeUntil, merge, last, take, map } from 'rxjs/operators';
import { Invocation, ExecutionRejectionInfo } from '@machinelabs/models';
import { ValidationRule } from './rules/rule';
import { ValidationContext } from './validation-context';
import { Resolver } from './resolver/resolver';
import { ValidationResult } from './validation-result';

export class ValidationService {

  private rules: Array<ValidationRule> = [];
  private resolver = new Map<Function, Resolver>();

  addResolver(resolverType: Function, resolver: Resolver) {
    this.resolver.set(resolverType, resolver);
    return this;
  }

  addRule(rule: ValidationRule) {
    this.rules.push(rule);
    return this;
  }

  validate(invocation: Invocation): Observable<ValidationContext> {

    let resolves = new Map<Function, Observable<any>>();
    let resolved = new Map<Function, any>();

    this.resolver.forEach((val, key) => {
      resolves.set(key, val.resolve(invocation)
                           .pipe(
                            tap(data => resolved.set(key, data)),
                            share()
                           ));
    });

    let results$ = from(this.rules)
                    .pipe(
                      mergeMap(rule => rule.check(invocation, resolves)),
                      share()
                    );

    let fails$ = results$.pipe(filter(result => result instanceof ExecutionRejectionInfo));

    return results$.pipe(
      takeUntil(fails$),
      merge(fails$.pipe(take(1))),
      last(),
      map((result: ValidationResult) => new ValidationContext(result, resolved))
    );
  }
}
