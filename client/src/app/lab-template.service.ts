import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { LabTemplate } from './models/lab';
import { LAB_TEMPLATES } from './data/lab-templates';

export const BLANK_LAB_TPL_ID = 'blank';
export const DEFAULT_LAB_TPL_ID = 'mnist';

export abstract class LabTemplateService {
  abstract getTemplate(name: string): Observable<LabTemplate>;
}

export class InMemoryLabTemplateService extends LabTemplateService {
  getTemplate(name: string): Observable<LabTemplate> {
    const template = LAB_TEMPLATES[name];
    return of(template ? JSON.parse(JSON.stringify(template)) : null);
  }
}
