import { Injectable, Inject } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import * as shortid from 'shortid';
import * as firebase from 'firebase';

import { Lab, LabStatus } from './models/lab';
import { DEFAULT_LAB_CODE } from './default-lab';
import { DATABASE } from './app.tokens';
import { AuthService } from './auth.service';

@Injectable()
export class LabStorageService {

  login$: Observable<any>;

  constructor(@Inject(DATABASE) private db, private authService: AuthService) {
    this.login$ = Observable.fromPromise(this.authService.authenticate())
                    .publishLast().refCount();
  }

  createLab(lab?: Lab): Lab {
    return {
      id: shortid.generate(),
      // TODO: we may wanna change the return type to Observable<Lab> and prefill with userId
      userId: '',
      name: 'Untitled',
      description: '',
      tags: [],
      files: lab ? lab.files : [{ name: 'main.py', content: DEFAULT_LAB_CODE }],
      status: LabStatus.Pristine
    };
  }

  getLab(id: string): Observable<Lab> {
    return this.login$
      .switchMap(_ => Observable.fromPromise(this.db.ref(`labs/${id}`).once('value')))
      .map((snapshot: any) => snapshot.val());
  }

  saveLab(lab: Lab): Observable<any> {
    return this.login$
      .switchMap((login: any) => {
        let res = this.db.ref(`labs/${lab.id}`).set({
          id: lab.id,
          user_id: login.uid,
          name: lab.name,
          description: lab.description,
          // `lab.tags` can be undefined when editing an existing lab that
          // doesn't have any tags yet.
          tags: lab.tags || [],
          files: lab.files,
          status: lab.status
        });
        return Observable.fromPromise(res);
      });
  }

}
