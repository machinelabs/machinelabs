import { Injectable } from '@angular/core';

import { Observable } from 'rxjs/Observable';
import { map } from 'rxjs/operators';
import { snapshotToValue } from './rx/snapshotToValue';

import { DbRefBuilder } from './firebase/db-ref-builder';

@Injectable()
export class DockerImageService {

  constructor(
    private db: DbRefBuilder
  ) { }

  getDockerImages() {
    return this.db.dockerImagesRef()
      .onceValue()
      .pipe(
        snapshotToValue,
        map((data: any) => Object.keys(data).map(id => data[id]))
      );
  }
}
