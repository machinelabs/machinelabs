import { NO_ERRORS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ComponentFixture, TestBed, inject } from '@angular/core/testing';
import { MdDialogModule, MdDialog } from '@angular/material';
import { ReactiveFormsModule } from '@angular/forms';
import { Observable } from 'rxjs/Observable';

import { EditLabDialogComponent } from './edit-lab-dialog.component';

import { LabStorageService } from '../../lab-storage.service';
import { DATABASE } from '../../app.tokens';
import { DbRefBuilder } from '../../firebase/db-ref-builder';
import { FirebaseMock } from '../../../test-helper/firebase-mock';
import { LabTemplateService, InMemoryLabTemplateService } from '../../lab-template.service';
import { AuthService } from '../../auth';

let loginUser = {
  uid: 'some-id',
  displayName: 'foo',
  email: 'foo@bar.de',
  isAnonymous: true,
  photoUrl: '/some/address'
};

let authServiceStub = {
  requireAuth: () => new Observable(obs => obs.next(loginUser)),
  requireAuthOnce: () => Observable.of(loginUser)
};

const lab = {
  id: 'some-id',
  name: 'lab name',
  description: 'Some description',
  tags: ['tag1', 'tag2', 'tag3']
};

describe('EditLabDialogComponent', () => {

  let component: EditLabDialogComponent;
  let fixture: ComponentFixture<EditLabDialogComponent>;
  let dialog: MdDialog;
  let fbMock: FirebaseMock;

  beforeEach(() => {

    fbMock = new FirebaseMock();

    TestBed.configureTestingModule({
      imports: [MdDialogModule.forRoot(), DialogTestModule],
      providers: [
        LabStorageService,
        { provide: LabTemplateService, useClass: InMemoryLabTemplateService },
        { provide: AuthService, useValue: authServiceStub },
        { provide: DATABASE, useValue: fbMock.mockDb() },
        DbRefBuilder
      ],
      schemas: [NO_ERRORS_SCHEMA]
    });
  });

  beforeEach(inject([MdDialog], (d: MdDialog) => {
    dialog = d;
  }));

  it('should initialize form with lab data', () => {
    let dialogRef = dialog.open(EditLabDialogComponent, {
      data: {
        lab: lab
      }
    });

    component = dialogRef.componentInstance;
    component.ngOnInit();

    expect(component.form.value.name).toEqual(lab.name);
    expect(component.form.value.description).toEqual(lab.description);
    expect(component.form.value.tags).toEqual(lab.tags.join(','));
  });

  it('should close dialog with right params on submit', (done) => {
    let dialogRef = dialog.open(EditLabDialogComponent, {
      data: {
        lab: lab
      }
    });

    spyOn(dialogRef, 'close');

    component = dialogRef.componentInstance;
    component.ngOnInit();

    component.form.value.name = 'foo';
    component.submit(component.form.value);
    setTimeout(_ => {
      expect(dialogRef.close).toHaveBeenCalledWith({ lab: component.lab, shouldSave: true});
      done();
    });
  });
});

@NgModule({
  imports: [MdDialogModule, ReactiveFormsModule, CommonModule],
  declarations: [EditLabDialogComponent],
  providers: [LabStorageService],
  exports: [EditLabDialogComponent],
  entryComponents: [EditLabDialogComponent],
  schemas: [NO_ERRORS_SCHEMA]
})
class DialogTestModule {}
