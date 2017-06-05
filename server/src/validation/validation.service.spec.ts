import 'jest';

import { ValidationService } from './validation.service';
import { ValidationRule } from './rules/rule';

import { Observable } from '@reactivex/rxjs';
import { ExtendedUser } from '../models/user';
import { ValidationContext } from '../models/validation-context';
import { ExecutionRejectionInfo, ExecutionRejectionReason } from '../models/execution';
import { Invocation } from '../models/invocation';

let dummyUser: ExtendedUser = {
  common: null,
  plan: null
};

let dummyInvocation: Invocation = {
  id: 'dummy',
  timestamp: Date.now(),
  user_id: 'dummy',
  type: 1,
  data: []
};

const userRef = (id: string) => Observable.of(dummyUser);

class FailedRule implements ValidationRule {
  check(context: ValidationContext) {
    return new ExecutionRejectionInfo(ExecutionRejectionReason.NoAnonymous, '');
  }
}

class ApprovedRule implements ValidationRule {
  check(context: ValidationContext) {
    return true;
  }
}

describe('.validate()', () => {
  it('should return ExecutionRejectionInfo if at least one rule fails', () => {
    expect.assertions(1);
    let svc = new ValidationService(userRef);
    svc.addRule(new FailedRule())
       .addRule(new ApprovedRule());

    svc.validate(dummyInvocation)
       .subscribe(validationContext => {
         expect(validationContext.validationResult).toBeInstanceOf(ExecutionRejectionInfo);
      });
  });

  it('should return true if all rules approve', () => {
    expect.assertions(1);
    let svc = new ValidationService(userRef);
    svc.addRule(new ApprovedRule());

    svc.validate(dummyInvocation)
       .subscribe(validationContext => {
         expect(validationContext.validationResult).toBeTruthy();
      });
  });

});
