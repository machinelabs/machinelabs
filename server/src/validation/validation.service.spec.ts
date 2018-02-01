import 'jest';

import { ValidationService } from './validation.service';
import { ValidationRule } from './rules/rule';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import { delay } from 'rxjs/operators';
import { Invocation, InvocationType, ExecutionRejectionInfo, ExecutionRejectionReason } from '@machinelabs/models';

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

describe('.validate()', () => {
  it('should return ExecutionRejectionInfo if at least one rule fails', () => {
    expect.assertions(1);
    let svc = new ValidationService();
    svc.addRule(new FailedRule())
       .addRule(new ApprovedRule());

    svc.validate(dummyInvocation)
       .subscribe((validationContext: any) => {
         expect(validationContext.validationResult).toBeInstanceOf(ExecutionRejectionInfo);
      });
  });

  it('should return true if all rules approve', () => {
    expect.assertions(1);
    let svc = new ValidationService();
    svc.addRule(new ApprovedRule());

    svc.validate(dummyInvocation)
       .subscribe((validationContext: any) => {
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
       .subscribe((validationContext: any) => {
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
       .subscribe((validationContext: any) => {
         let elapsedTime = Date.now() - backThen;
         expect(validationContext.validationResult).toBeInstanceOf(ExecutionRejectionInfo);
         expect(elapsedTime >= 1000).toBeTruthy();
         done();
      });
  });

});
