import { Injectable, Inject } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import * as shortid from 'shortid';
import * as firebase from 'firebase';

import { Lab } from './models/lab';
import { DEFAULT_LAB_CODE } from './default-lab';
import { DATABASE } from './app.tokens';
import { AuthService } from './auth';

@Injectable()
export class LabStorageService {

  constructor(@Inject(DATABASE) private db, private authService: AuthService) {
  }

  createLab(lab?: Lab): Observable<Lab> {
    return this.authService
      .requireAuthOnce()
      .map(user => {
        return {
          id: shortid.generate(),
          user_id: user.uid,
          name: lab ? `Fork of ${lab.name}` : 'Untitled',
          description: lab ? lab.description : '',
          tags: lab ? lab.tags: [],
          files: lab ? lab.files : [{ name: 'main.py', content: DEFAULT_LAB_CODE }]
        };
      });
  }

  getLab(id: string): Observable<Lab> {
    return this.authService
              .requireAuthOnce()
              .switchMap(_ => Observable.fromPromise(this.db.ref(`labs/${id}`).once('value')))
              .map((snapshot: any) => snapshot.val());
  }

  saveLab(lab: Lab): Observable<any> {
    return this.authService
              .requireAuthOnce()
              .switchMap((login: any) => {
                let res = this.db.ref(`labs/${lab.id}`).set({
                  id: lab.id,
                  user_id: login.uid,
                  name: lab.name,
                  description: lab.description,
                  // `lab.tags` can be undefined when editing an existing lab that
                  // doesn't have any tags yet.
                  tags: lab.tags || [],
                  files: lab.files
                });
                return Observable.fromPromise(res);
              });
  }

}
