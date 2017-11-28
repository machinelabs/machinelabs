import { Observable } from '@reactivex/rxjs';
import { ObservableDbRef, DbRefBuilder } from '@machinelabs/core';

export class LiveMetricsService {

  constructor(private db: DbRefBuilder) {

  }

  getLiveExecutionsRef() {
    return this.db.userExecutions()
                  .orderByChild('live')
                  .startAt('');
  }

}
