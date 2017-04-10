import { Injectable, Inject } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import * as shortid from 'shortid';
import * as firebase from 'firebase';

import { Lab, LabTemplate } from './models/lab';
import { DbRefBuilder } from './firebase/db-ref-builder';
import { AuthService } from './auth';
import { LabTemplateService } from './lab-template.service';

@Injectable()
export class LabStorageService {

  constructor(
    private db: DbRefBuilder,
    private authService: AuthService,
    private labTemplateService: LabTemplateService) {}

  createLab(lab?: Lab | LabTemplate): Observable<Lab> {
    return this.authService
      .requireAuthOnce()
      .map(user => {
        return new Lab({
          id: shortid.generate(),
          user_id: user.uid,
          name: lab ? `Fork of ${lab.name}` : 'Untitled',
          description: lab ? lab.description : '',
          tags: lab ? lab.tags: [],
          files: lab ? lab.files : [{ name: 'main.py', content: '' }]
        });
      });
  }

  createLabFromTemplate(templateName: string): Observable<Lab> {
    return this.labTemplateService
        .getTemplate(templateName)
        .switchMap(template => template ? this.createLab(template) : this.createLab());
  }

  getLab(id: string): Observable<Lab> {
    return this.authService
              .requireAuthOnce()
              .switchMap(_ => this.db.labRef(id).onceValue())
              .map((snapshot: any) => snapshot.val());
  }

  saveLab(lab: Lab): Observable<any> {
    return this.authService
              .requireAuthOnce()
              .switchMap((login: any) => this.db.labRef(lab.id).set({
                  id: lab.id,
                  user_id: login.uid,
                  name: lab.name,
                  description: lab.description,
                  // `lab.tags` can be undefined when editing an existing lab that
                  // doesn't have any tags yet.
                  tags: lab.tags || [],
                  files: lab.files
                }));
  }

}
