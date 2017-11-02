import * as shortid from 'shortid';
import * as firebase from 'firebase';

import { Injectable, Inject } from '@angular/core';

import { Observable } from 'rxjs/Observable';
import { forkJoin } from 'rxjs/observable/forkJoin';
import { of } from 'rxjs/observable/of';
import { map, switchMap } from 'rxjs/operators';
import { snapshotToValue } from './rx/snapshotToValue';

import { Lab, LabTemplate } from './models/lab';
import { DbRefBuilder } from './firebase/db-ref-builder';
import { AuthService } from './auth';
import { LabTemplateService } from './lab-template.service';
import { ML_YAML_FILE } from './data/ml.yaml';
import { stringifyDirectory } from './util/directory';
import { parseLabDirectory } from '@machinelabs/core/dist/src/io/lab-fs/parse';

@Injectable()
export class LabStorageService {

  constructor(
    private db: DbRefBuilder,
    private authService: AuthService,
    private labTemplateService: LabTemplateService) {}

  createLab(lab?: Lab | LabTemplate): Observable<Lab> {
    return this.authService
      .requireAuthOnce().pipe(
        map(user => {
          return {
            id: shortid.generate(),
            user_id: user.uid,
            name: lab ? `Fork of ${lab.name}` : 'Untitled',
            description: lab ? lab.description : '',
            tags: lab ? lab.tags : [],
            directory: lab ? lab.directory : [{ name: 'main.py', content: '' }, ML_YAML_FILE],
            hidden: false,
            created_at: Date.now(),
            modified_at: Date.now(),
            fork_of: lab && (<Lab>lab).id ? (<Lab>lab).id : null
          };
        })
      );
  }

  createLabFromTemplate(templateName: string): Observable<Lab> {
    return this.labTemplateService.getTemplate(templateName)
        .pipe(switchMap(template => template ? this.createLab(template) : this.createLab()))
  }

  getLab(id: string): Observable<Lab> {
    return this.authService.requireAuthOnce().pipe(
      switchMap(_ => this.db.labRef(id).onceValue()),
      snapshotToValue,
      map(value => {
        // existing lab directories might not be converted yet
        // this can be removed once we know for sure that all lab directories
        // are strings in the database
        if (value) {
          value.directory = parseLabDirectory(value.directory);
        }
        return value;
      })
    );
  }


  labExists(id: string) {
    return this.getLab(id).pipe(map(lab => !!lab && !lab.hidden));
  }

  saveLab(lab: Lab): Observable<any> {
    return this.authService.requireAuthOnce().pipe(
      switchMap((login: any) => this.db.labRef(lab.id).set({
          id: lab.id,
          user_id: login.uid,
          name: lab.name,
          description: lab.description,
          // `lab.tags` can be undefined when editing an existing lab that
          // doesn't have any tags yet.
          tags: lab.tags || [],
          directory: stringifyDirectory(lab.directory),
          // We typecast `hidden` to boolean to ensure exsting labs that haven't
          // migrated yet (and therefore don't have a `hidden` property) don't
          // make this code break.
          //
          // TODO(pascal): This can be removed once all labs have been migrated.
          hidden: !!lab.hidden,
          created_at: lab.created_at,
          modified_at: firebase.database.ServerValue.TIMESTAMP,
          fork_of: lab.fork_of || null
        }))
    );
  }

  getLabsFromUser(userId: string): Observable<Array<Lab>> {
    return this.db.userVisibleLabsRef(userId).onceValue().pipe(
      snapshotToValue,
      map(labIds => Object.keys(labIds || {})),
      map(labIds => labIds.map(labId => this.getLab(labId))),
      switchMap(labRefs => labRefs.length ? forkJoin(labRefs) : of([])),
      // This shouldn't happen, but in case we fetch labs
      // that don't exist anymore, resuling in `null` fields, we need
      // to filter them out.
      map(labs => labs.filter(lab => lab)),
      map(labs => labs.sort((a, b) => b.modified_at - a.modified_at))
    );
  }

}
