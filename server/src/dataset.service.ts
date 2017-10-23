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

  containsVersion(dataset: Dataset, version: string) {
    return version in dataset.versions;
  }

  userCanAccessDataset(userId: string, dataset: Dataset) {
    return dataset && (dataset.userId === userId || !dataset.private);
  }
}
