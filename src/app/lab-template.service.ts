import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { LabTemplate } from './models/lab';
import { LAB_TEMPLATES } from './data/lab-templates';


export abstract class LabTemplateService {
  abstract getTemplate(name: string): Observable<LabTemplate>;
}

export class InMemoryLabTemplateService extends LabTemplateService {

  getTemplate(name: string): Observable<LabTemplate> {
    return Observable.of(LAB_TEMPLATES[name]);
  }
}
