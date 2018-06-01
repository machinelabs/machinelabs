import { NO_ERRORS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ComponentFixture, TestBed, inject } from '@angular/core/testing';
import { MatDialogModule, MatDialog } from '@angular/material';
import { ReactiveFormsModule } from '@angular/forms';
import { Observable, of } from 'rxjs';

import { DATABASE } from '../../app.tokens';
import { FirebaseMock } from '../../../test-helper/firebase-mock';
import { DbRefBuilder } from '../../firebase/db-ref-builder';
import { AuthService } from '../../auth';
import { UserService } from '../../user/user.service';

import { EditUserProfileDialogComponent } from './edit-user-profile-dialog.component';

@NgModule({
  imports: [MatDialogModule, ReactiveFormsModule, CommonModule],
  declarations: [EditUserProfileDialogComponent],
  providers: [UserService],
  exports: [EditUserProfileDialogComponent],
  entryComponents: [EditUserProfileDialogComponent],
  schemas: [NO_ERRORS_SCHEMA]
})
class DialogTestModule {}

const loginUser = {
  uid: 'some-id',
  displayName: 'foo',
  email: 'foo@bar.de',
  bio: '',
  isAnonymous: false,
  photoUrl: '/some/address'
};

const authServiceStub = {
  requireAuth: () => new Observable(obs => obs.next(loginUser)),
  requireAuthOnce: () => of(loginUser)
};

describe('EditUserProfileDialogComponent', () => {
  let component: EditUserProfileDialogComponent;
  let dialog: MatDialog;
  let fbMock: FirebaseMock;

  beforeEach(() => {
    fbMock = new FirebaseMock();

    TestBed.configureTestingModule({
      imports: [MatDialogModule, DialogTestModule],
      providers: [
        { provide: AuthService, useValue: authServiceStub },
        { provide: DATABASE, useValue: fbMock.mockDb() },
        DbRefBuilder
      ],
      schemas: [NO_ERRORS_SCHEMA]
    });
  });

  beforeEach(
    inject([MatDialog], (d: MatDialog) => {
      dialog = d;
    })
  );

  it('should initialize form with user data', () => {
    const dialogRef = dialog.open(EditUserProfileDialogComponent, {
      data: {
        user: loginUser
      }
    });

    component = dialogRef.componentInstance;
    component.ngOnInit();

    expect(component.form.value.displayName).toEqual(loginUser.displayName);
    expect(component.form.value.bio).toEqual(loginUser.bio);
  });

  it('should close dialog with right params on submit', done => {
    const dialogRef = dialog.open(EditUserProfileDialogComponent, {
      data: {
        user: loginUser
      }
    });

    spyOn(dialogRef, 'close');

    component = dialogRef.componentInstance;
    component.ngOnInit();

    component.form.value.displayName = 'another name';
    component.submit(component.form.value);
    setTimeout(_ => {
      expect(dialogRef.close).toHaveBeenCalledWith(component.user);
      done();
    });
  });
});
