import 'jest';

import { ValidationService } from './validation.service';
import { ValidationRule } from './rules/rule';
import { Observable } from '@reactivex/rxjs';
import { ExecutionRejectionInfo, ExecutionRejectionReason } from '../models/execution';
import { Invocation } from '../models/invocation';

let dummyInvocation: Invocation = {
  id: 'dummy',
  timestamp: Date.now(),
  user_id: 'dummy',
  type: 1,
  data: []
};

class FailedRule implements ValidationRule {
  constructor(private resolveAfter = 0) {}

  check(context: Invocation, resolves: Map<Function, Observable<any>>) {
    let obs = Observable.of(new ExecutionRejectionInfo(ExecutionRejectionReason.NoAnonymous, ''));

    return this.resolveAfter === 0 ? obs : obs.delay(this.resolveAfter);
  }
}

class ApprovedRule implements ValidationRule {
  constructor(private resolveAfter = 0) {}

  check(context: Invocation, resolves: Map<Function, Observable<any>>) {
    let obs = Observable.of(true);

    return this.resolveAfter === 0 ? obs : obs.delay(this.resolveAfter);
  }
}

describe('.validate()', () => {
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
