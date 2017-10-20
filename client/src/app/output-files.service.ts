import * as firebase from 'firebase';

import { Injectable } from '@angular/core';
import { DbRefBuilder } from './firebase/db-ref-builder';
import { AuthService } from './auth';
import { OutputFile } from './models/output-file';
import { Observable } from 'rxjs/Observable';
import { fromPromise } from 'rxjs/observable/fromPromise';
import { map, switchMap, startWith, take, flatMap } from 'rxjs/operators';

const fromSnapshot = snapshot => snapshot.val();

@Injectable()
export class OutputFilesService {

  constructor(
    private db: DbRefBuilder,
    private authService: AuthService
  ) {}

  observeOutputFilesFromExecution(executionId: string): Observable<OutputFile> {
    return this.authService
      .requireAuthOnce()
      .pipe(
        switchMap(_ => this.db.executionOutputFilesRef(executionId).childAdded().pipe(map(fromSnapshot))),
        flatMap(file => this.getDownloadUrlForPath(file.path).pipe(map(download_url => ({...file, download_url}))))
      );
  }

  getDownloadUrlForPath(path: string) {
    return fromPromise(firebase.storage()
                                .ref(path)
                                .getDownloadURL());
  }

  hasOutputFiles(executionId: string) {
    return this.observeOutputFilesFromExecution(executionId).pipe(
      map(output => !!output),
      startWith(false),
      take(2)
    );
  }
}

