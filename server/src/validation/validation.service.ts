import { DbRefBuilder } from '../ml-firebase';
import { Observable } from '@reactivex/rxjs';
import { Invocation} from '../models/invocation';
import { ValidationRule } from './rules/rule';
import { NoAnonymousRule } from './rules/no-anonymous';
import { HasPlanRule } from './rules/has-plan';
import { ValidationContext } from '../models/validation-context';
import { ExecutionRejectionInfo } from '../models/execution';
import { ExtendedUser } from '../models/user';

export function userRefFactory () {
  let db = new DbRefBuilder();
  return (id: string) => {
    return db.userRef(id)
            .onceValue()
            .map(snapshot => snapshot.val());
  };
}

export class ValidationService {

  rules: Array<ValidationRule> = [];

  constructor(private userRef: (id:string) => Observable<ExtendedUser>){}

  addRule(rule: ValidationRule) {
    this.rules.push(rule);
    return this;
  }

  validate(invocation: Invocation) : Observable<ValidationContext> {
    return this.userRef(invocation.user_id)
                  .switchMap(user => {

                    let validationContext = new ValidationContext(invocation, user);

                    //This is written with a for..of because we want to
                    //short circuit at the first failed rule.

                    for (let rule of this.rules) {
                      let validationResult = rule.check(validationContext);
                      validationContext.validationResult = validationResult;
                      if (validationResult instanceof ExecutionRejectionInfo) {
                        console.log(`Validation failed: ${validationResult.message}`);
                        return Observable.of(validationContext);
                      }
                    }

                    return Observable.of(validationContext);
                  });
  }
}