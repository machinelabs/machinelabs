import { DbRefBuilder } from '../ml-firebase';
import { Observable } from '@reactivex/rxjs';
import { Invocation} from '../models/invocation';
import { ValidationRule } from './rules/rule';
import { NoAnonymousRule } from './rules/no-anonymous';
import { HasPlanRule } from './rules/has-plan';
import { ValidationContext } from '../models/validation-context';

export class ValidationService {

  db = new DbRefBuilder();
  rules: Array<ValidationRule> = [];

  addRule(rule: ValidationRule) {
    this.rules.push(rule);
    return this;
  }

  validate(invocation: Invocation) : Observable<ValidationContext> {

    return this.db.userRef(invocation.user_id)
                  .onceValue()
                  .map(snapshot => snapshot.val())
                  .switchMap(user => {

                    let validationContext = new ValidationContext(invocation, user);

                    //This is written with a for..of because we want to
                    //short circuit at the first failed rule.

                    for (let rule of this.rules) {
                      let approval = rule.check(validationContext);
                      Object.assign(validationContext.approval, approval);
                      if (!approval.allowExecution) {
                        console.log(`Validation failed: ${approval.message}`);
                        return Observable.of(validationContext);
                      }
                    }

                    return Observable.of(validationContext);
                  });
  }
}