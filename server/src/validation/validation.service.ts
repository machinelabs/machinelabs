import { Observable, from, asapScheduler } from 'rxjs';
import {
  tap,
  observeOn,
  share,
  filter,
  mergeMap,
  takeUntil,
  merge,
  last,
  take,
  map,
  shareReplay
} from 'rxjs/operators';
import { Invocation, ExecutionRejectionInfo } from '@machinelabs/models';
import { ValidationRule } from './rules/rule';
import { ValidationContext } from './validation-context';
import { Resolver } from './resolver/resolver';
import { ValidationResult } from './validation-result';

export type ResolvedMap = Map<Function, any>;

export class ValidationService {
  private rules: Array<ValidationRule> = [];
  private resolver = new Map<Function, Resolver>();
  private transformers: Array<(val: ResolvedMap) => void> = [];

  addResolver(resolverType: Function, resolver: Resolver) {
    this.resolver.set(resolverType, resolver);
    return this;
  }

  addRule(rule: ValidationRule) {
    this.rules.push(rule);
    return this;
  }

  addTransformer(transformer: (val: ResolvedMap) => void) {
    this.transformers.push(transformer);
    return this;
  }

  validate(invocation: Invocation): Observable<ValidationContext> {
    const resolves = new Map<Function, Observable<any>>();
    const resolved = new Map<Function, any>();

    this.resolver.forEach((val, key) => {
      resolves.set(
        key,
        val.resolve(invocation).pipe(
          tap(data => resolved.set(key, data)),
          tap(() => this.transformers.forEach(fn => fn(resolved))),
          // Ensure we map to the value from the `resolved` map.
          // Otherwise if a resolver resolves to some primitive
          // there would be no way for a transformer to actually
          // transform it.
          map(() => resolved.get(key)),
          shareReplay(1)
        )
      );
    });

    const results$ = from(this.rules).pipe(mergeMap(rule => rule.check(invocation, resolves)), share());

    const fails$ = results$.pipe(
      filter(result => result instanceof ExecutionRejectionInfo),
      // This might look strange but we have to ensure fail$ emits
      // asynchronously, as takeUntil won't subscribe to its source
      // stream otherwise.
      //
      // See: https://github.com/ReactiveX/rxjs/issues/3727
      observeOn(asapScheduler)
    );

    return results$.pipe(
      takeUntil(fails$),
      merge(fails$.pipe(take(1))),
      last(),
      map((result: ValidationResult) => new ValidationContext(result, resolved))
    );
  }
}
