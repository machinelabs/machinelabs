import * as firebase from 'firebase';

import { Injectable } from '@angular/core';
import { DbRefBuilder } from './firebase/db-ref-builder';
import { AuthService } from './auth';
import { OutputFile } from './models/output-file';
import { Observable } from 'rxjs/Observable';

import 'rxjs/add/operator/map';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/take';
import 'rxjs/add/operator/mergeMap';

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
               .switchMap(_ => this.db.executionOutputFilesRef(executionId).childAdded().map(fromSnapshot))
               .flatMap(file => this.getDownloadUrlForPath(file.path).map(download_url => ({...file, download_url})));
  }

  getDownloadUrlForPath(path: string) {
    return Observable.fromPromise(firebase.storage()
                                          .ref(path)
                                          .getDownloadURL());
  }

  hasOutputFiles(executionId: string) {
    return this.observeOutputFilesFromExecution(executionId)
        .take(1)
        .map(output => !!output);
  }
}

