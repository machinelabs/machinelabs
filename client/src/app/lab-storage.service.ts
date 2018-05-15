import * as shortid from 'shortid';
import * as firebase from 'firebase';

import { Injectable, Inject } from '@angular/core';

import { Observable, forkJoin, of } from 'rxjs';
import { map, switchMap, mergeMap, catchError } from 'rxjs/operators';
import { snapshotToValue } from './rx/snapshotToValue';

import { Lab, LabTemplate } from './models/lab';
import { DbRefBuilder } from './firebase/db-ref-builder';
import { AuthService } from './auth';
import { LabTemplateService } from './lab-template.service';
import { ML_YAML_FILE, parseLabDirectory } from '@machinelabs/core';
import { stringifyDirectory } from './util/directory';

@Injectable()
export class LabStorageService {
  constructor(
    private db: DbRefBuilder,
    private authService: AuthService,
    private labTemplateService: LabTemplateService
  ) {}

  createLab(lab?: Lab | LabTemplate): Observable<Lab> {
    return this.authService.requireAuthOnce().pipe(
      map(user => {
        return {
          id: shortid.generate(),
          user_id: user.uid,
          name: this.determineLabName(lab),
          description: lab ? lab.description : '',
          tags: lab ? lab.tags : [],
          directory: lab ? lab.directory : [{ name: 'main.py', content: '' }, ML_YAML_FILE],
          hidden: false,
          created_at: Date.now(),
          modified_at: Date.now(),
          fork_of: lab && (<Lab>lab).id ? (<Lab>lab).id : null,
          is_private: false
        };
      })
    );
  }

  createLabFromTemplate(templateName: string): Observable<Lab> {
    return this.labTemplateService
      .getTemplate(templateName)
      .pipe(switchMap(template => (template ? this.createLab(template) : this.createLab())));
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
          // Private labs have been introduced much later which is why we
          // need to ensure that `is_private` is set
          value.is_private = !!value.is_private;
        }
        return value;
      })
    );
  }

  getRecentLabs(limitToLast = 10) {
    const recentLabs$ = this.db
      .recentLabsRef()
      .orderByChild('updated_at')
      .limitToLast(limitToLast)
      .onceValue();

    return this.authService.requireAuthOnce().pipe(
      switchMap(_ => recentLabs$),
      map((snapshot: any) => {
        const labs = [];

        snapshot.forEach(childSnapshot => {
          labs.unshift(childSnapshot.val());
        });

        return labs;
      }),
      map(labs => labs.map(lab => this.getLab(lab.lab_id))),
      mergeMap(labs => (labs.length ? forkJoin(labs) : of([]))),
      map(labs => labs.filter(lab => !!lab))
    );
  }

  labExists(id: string) {
    return this.getLab(id).pipe(map(lab => !!lab && !lab.hidden));
  }

  saveLab(lab: Lab): Observable<any> {
    return this.authService.requireAuthOnce().pipe(
      switchMap((login: any) =>
        this.db.labRef(lab.id).set({
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
          fork_of: lab.fork_of || null,
          is_private: lab.is_private
        })
      )
    );
  }

  getLabsFromUser(userId: string): Observable<Array<Lab>> {
    return this.db
      .userVisibleLabsRef(userId)
      .onceValue()
      .pipe(
        snapshotToValue,
        map(labIds => Object.keys(labIds || {})),
        // Note that we're swallowing errors caused by single getLab()
        // calls, to not cause the following forkJoin() to break. This
        // lets us show only a subset of the available labs (e.g. only public labs)
        // of a user.
        map(labIds => labIds.map(labId => this.getLab(labId).pipe(catchError(_ => of(null))))),
        switchMap(labRefs => (labRefs.length ? forkJoin(labRefs) : of([]))),
        // Chances are that some labs resulted in `null` so we filter those out
        map(labs => labs.filter(lab => lab)),
        map(labs => labs.sort((a, b) => b.modified_at - a.modified_at))
      );
  }

  private determineLabName(lab?: Lab | LabTemplate) {
    if (lab) {
      return lab.name.startsWith('Fork of') ? lab.name : `Fork of ${lab.name}`;
    }
    return 'Untitled';
  }
}
