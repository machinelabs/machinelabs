import { DbRefBuilder } from './ml-firebase';
import { Observable } from '@reactivex/rxjs';
import { Invocation} from './models/invocation';
import { Approval } from './models/approval';

export class RulesService {

  db = new DbRefBuilder();

  constructor() {
  }

  getApproval(invocation: Invocation) : Observable<Approval> {
    return this.db.userRef(invocation.user_id)
                  .onceValue()
                  .map(snapshot => snapshot.val())
                  .switchMap(user => {
                    let approval = !user || user.isAnonymous ? this.rejectAnonymous(invocation) : this.allow(invocation);
                    return Observable.of(approval);
                  });
  }

  private rejectAnonymous(invocation: Invocation) : Approval {
    return {
      invocation: invocation,
      message: 'Anonymous user can only replay existing runs.',
      allowExecution: false,
      maxTime: 0
    }
  }

  private allow(invocation: Invocation) : Approval {
    return {
      invocation: invocation,
      message: 'ok',
      allowExecution: true,
      //TODO: Maybe some sort of limit would make sense? Don't know
      maxTime: Number.POSITIVE_INFINITY
    }
  }

}