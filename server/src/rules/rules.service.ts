import { DbRefBuilder } from '../ml-firebase';
import { Observable } from '@reactivex/rxjs';
import { Invocation} from '../models/invocation';
import { Approval } from '../models/approval';
import { allow } from './rules/rule';
import { NoAnonymousRule } from './rules/no-anonymous';
import { HasPlanRule } from './rules/has-plan';

export class RulesService {

  db = new DbRefBuilder();
  rules = [
    new NoAnonymousRule(),
    new HasPlanRule()
  ];

  constructor() {
  }

  getApproval(invocation: Invocation) : Observable<Approval> {
    return this.db.userRef(invocation.user_id)
                  .onceValue()
                  .map(snapshot => snapshot.val())
                  .switchMap(user => {
                    //This is written with a for..of because we want to
                    //short circuit at the first failed rule.

                    for (let rule of this.rules) {
                      let approval = rule.check(invocation, user);
                      if (!approval.allowExecution) {
                        return Observable.of(approval);
                      }
                    }

                    return Observable.of(allow(invocation));
                  });
  }
}