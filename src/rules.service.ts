import { DbRefBuilder } from './ml-firebase';
import { Observable } from '@reactivex/rxjs';
import { Run} from './models/run';
import { Approval } from './models/approval';

export class RulesService {

  db = new DbRefBuilder();

  constructor() {
  }

  getApproval(run: Run) : Observable<Approval> {
    return this.db.userRef(run.user_id)
                  .onceValue()
                  .map(snapshot => snapshot.val())
                  .switchMap(user => {
                    let approval = user.isAnonymous ? this.rejectAnonymous(run) : this.allow(run);
                    return Observable.of(approval);
                  });
  }

  private rejectAnonymous(run: Run) : Approval {
    return {
      run: run,
      message: 'Anonymous user can only replay existing runs.',
      canRun: false,
      maxTime: 0
    }
  }

  private allow(run: Run) : Approval {
    return {
      run: run,
      message: 'ok',
      canRun: true,
      //TODO: Maybe some sort of limit would make sense? Don't know
      maxTime: Number.POSITIVE_INFINITY
    }
  }

}