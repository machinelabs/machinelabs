import 'jest';

import { ValidationService } from './validation.service';
import { ValidationRule } from './rules/rule';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import { delay, map } from 'rxjs/operators';
import { Invocation, InvocationType, ExecutionRejectionInfo, ExecutionRejectionReason } from '@machinelabs/models';
import { Resolver } from 'src/validation/resolver/resolver';
import isBoolean = require('lodash.isboolean');
import { ValidationError } from 'src/validation/validation-result';


let dummyInvocation: Invocation = {
  id: 'dummy',
  timestamp: Date.now(),
  user_id: 'dummy',
  type: InvocationType.StopExecution,
  data: []
};

class FailedRule implements ValidationRule {
  constructor(private resolveAfter = 0) {}

  check(context: Invocation, resolves: Map<Function, Observable<any>>) {
    let obs = of(new ExecutionRejectionInfo(ExecutionRejectionReason.NoAnonymous, ''));

    return this.resolveAfter === 0 ? obs : obs.pipe(delay(this.resolveAfter));
  }
}

class ApprovedRule implements ValidationRule {
  constructor(private resolveAfter = 0) {}

  check(context: Invocation, resolves: Map<Function, Observable<any>>) {
    let obs = of(true);

    return this.resolveAfter === 0 ? obs : obs.pipe(delay(this.resolveAfter));
  }
}

class TrueResolver implements Resolver {

  calls = 0;

  resolve(invocation: Invocation): Observable<boolean> {
    this.calls++;

    return of(true);
  }
}

class IsTrueRule implements ValidationRule {
  check(validationContext: Invocation, resolves: Map<Function, Observable<any>>): Observable<boolean | ValidationError> {
    return resolves.get(TrueResolver)
                   .pipe(map(val => {
                      if (!val) {
                        return new ExecutionRejectionInfo(null, 'must be true');
                      }
                      return true;
                   }));
  }
}

class IsBooleanRule implements ValidationRule {
  check(validationContext: Invocation, resolves: Map<Function, Observable<any>>): Observable<boolean | ValidationError> {
    return resolves.get(TrueResolver)
                   .pipe(map(val => {
                      if (!isBoolean(val)) {
                        return new ExecutionRejectionInfo(null, 'must be boolean');
                      }
                      return true;
                    }));
  }
}

describe('.validate()', () => {

  it('should cache resolves', () => {
    expect.assertions(2);
    let svc = new ValidationService();
    let dummyResolver = new TrueResolver();
    svc.addResolver(TrueResolver, dummyResolver)
       .addRule(new IsTrueRule())
       .addRule(new IsBooleanRule());


    svc.validate(dummyInvocation)
       .subscribe(validationContext => {
         expect(validationContext.validationResult).toBeTruthy();
         expect(dummyResolver.calls).toBe(1);
      });
  });

  it('should return ExecutionRejectionInfo if at least one rule fails', () => {
    expect.assertions(1);
    let svc = new ValidationService();
    svc.addRule(new FailedRule())
       .addRule(new ApprovedRule());

    svc.validate(dummyInvocation)
       .subscribe(validationContext => {
         expect(validationContext.validationResult).toBeInstanceOf(ExecutionRejectionInfo);
      });
  });

  it('should return true if all rules approve', () => {
    expect.assertions(1);
    let svc = new ValidationService();
    svc.addRule(new ApprovedRule());

    svc.validate(dummyInvocation)
       .subscribe(validationContext => {
         expect(validationContext.validationResult).toBeTruthy();
      });
  });

  it('should not continue to resolve after first rule rejected', (done) => {
    expect.assertions(2);
    let svc = new ValidationService();
    svc.addRule(new FailedRule(100))
       .addRule(new ApprovedRule(1000));

    let backThen = Date.now();
    svc.validate(dummyInvocation)
       .subscribe(validationContext => {
         let elapsedTime = Date.now() - backThen;
         expect(validationContext.validationResult).toBeInstanceOf(ExecutionRejectionInfo);
         expect(elapsedTime < 500).toBeTruthy();
         done();
      });
  });

    it('should continue to resolve until first rule fails (if any)', (done) => {
    expect.assertions(2);
    let svc = new ValidationService();
    svc.addRule(new FailedRule(1000))
       .addRule(new ApprovedRule(100));

    let backThen = Date.now();
    svc.validate(dummyInvocation)
       .subscribe(validationContext => {
         let elapsedTime = Date.now() - backThen;
         expect(validationContext.validationResult).toBeInstanceOf(ExecutionRejectionInfo);
         expect(elapsedTime >= 1000).toBeTruthy();
         done();
      });
  });

});
