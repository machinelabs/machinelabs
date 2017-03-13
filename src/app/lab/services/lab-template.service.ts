import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Lab } from '../models/lab';

export abstract class LabTemplateService {
  abstract getTemplate(name: string): Observable<Lab>;
}

@Injectable()
export class InMemoryLabTemplateService extends LabTemplateService {

  getTemplate(name: string): Observable<Lab> {
    return Observable.of({name});
  }
}
