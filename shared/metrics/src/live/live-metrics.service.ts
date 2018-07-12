import { ObservableDbRef, DbRefBuilder } from '@machinelabs/core';
import { Observable } from 'rxjs';

export class LiveMetricsService {
  constructor(private db: DbRefBuilder) {}

  getLiveExecutionsRef() {
    return this.db
      .userExecutions()
      .orderByChild('live')
      .startAt('');
  }
}
