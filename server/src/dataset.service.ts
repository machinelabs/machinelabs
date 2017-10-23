import { Observable } from '@reactivex/rxjs';
import { DbRefBuilder } from '@machinelabs/core';
import { Dataset } from '@machinelabs/models';

export class DatasetService {

  constructor(private db: DbRefBuilder) {}

  getDataset(userId: string, datasetId: string): Observable<Dataset> {
    return this.db.datasetRef(userId, datasetId)
                  .onceValue()
                  .map(snapshot => snapshot.val());
  }

  userCanAccessDataset(userId: string, dataset: Dataset) {
    return dataset && (dataset.userId === userId || !dataset.private);
  }
}
