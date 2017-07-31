import { TestBed } from '@angular/core/testing';
import { LabTemplateService, InMemoryLabTemplateService, DEFAULT_LAB_TPL_ID } from './lab-template.service';
import { LAB_TEMPLATES } from './data/lab-templates';

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
        labTemplateService.getTemplate(DEFAULT_LAB_TPL_ID).subscribe(tpl => {
          expect(tpl).toEqual(LAB_TEMPLATES[DEFAULT_LAB_TPL_ID]);
        });
      });
    });
  });
});
