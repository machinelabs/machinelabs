import { TestBed } from '@angular/core/testing';
import { LAB_TEMPLATES } from '../data/lab-templates';
import { LabTemplateService, InMemoryLabTemplateService } from './lab-template.service';

describe('LabTemplateService', () => {

  let labTemplateService: LabTemplateService;

  describe('InMemoryLabTemplateService', () => {

    beforeEach(() => {
      TestBed.configureTestingModule({
        providers: [
          { provide: LabTemplateService, useClass: InMemoryLabTemplateService }
        ]
      });

      labTemplateService = TestBed.get(LabTemplateService);
    });

    describe('getTemplate()', () => {

      it('should emit a lab template by a given template name', () => {
        labTemplateService.getTemplate('XOR').subscribe(tpl => {
          expect(tpl).toEqual(LAB_TEMPLATES['XOR']);
        });
      });
    });
  });
});
