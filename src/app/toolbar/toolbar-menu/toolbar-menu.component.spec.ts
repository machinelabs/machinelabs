import { NO_ERRORS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterTestingModule } from '@angular/router/testing';
import { TestBed, ComponentFixture } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { Observable } from 'rxjs/Observable';

import { ToolbarMenuComponent } from './toolbar-menu.component';
import { MachineLabsMaterialModule } from '../../ml-material.module';
import { AuthService, dummyUser } from '../../auth/';
import { UserService } from '../../user/user.service';
import { DATABASE } from '../../app.tokens';
import { FirebaseMock } from '../../../test-helper/firebase-mock';
import { DbRefBuilder } from '../../firebase/db-ref-builder';

let authServiceStub = {
  requireAuth: () => {},
  requireAuthOnce: () => {},
  linkOrSignInWithGitHub: () => {},
  signOut: () => {}
};

describe('ToolbarMenuComponent', () => {

  let fixture: ComponentFixture<ToolbarMenuComponent>;
  let component: ToolbarMenuComponent;
  let authService: AuthService;
  let userService: UserService;
  let fbMock: FirebaseMock;

  beforeEach(() => {

    fbMock = new FirebaseMock();

    TestBed.configureTestingModule({
      declarations: [ToolbarMenuComponent],
      imports: [
        MachineLabsMaterialModule,
        CommonModule,
        RouterTestingModule
      ],
      providers: [
        { provide: AuthService, useValue: authServiceStub },
        { provide: DATABASE, useValue: fbMock.mockDb() },
        UserService,
        DbRefBuilder,
      ],
      schemas: [NO_ERRORS_SCHEMA]
    });

    fixture = TestBed.createComponent(ToolbarMenuComponent);
    component = fixture.componentInstance;
    authService = TestBed.get(AuthService);
    userService = TestBed.get(UserService);

    spyOn(authService, 'linkOrSignInWithGitHub').and.returnValue(Observable.of(dummyUser));
    spyOn(authService, 'signOut').and.returnValue(Observable.of(null));
    spyOn(userService, 'createUserIfMissing').and.returnValue(Observable.of(dummyUser));
  });

  it('should login via GitHub', () => {
    spyOn(userService, 'observeUserChanges').and.returnValue(Observable.of(dummyUser));
    fixture.detectChanges();
    const menuButton = fixture.debugElement.query(By.css('[md-icon-button]'));

    // open menu
    menuButton.triggerEventHandler('click', null);

    const loginButton = fixture.debugElement.query(By.css('.mat-menu-panel button'));

    loginButton.triggerEventHandler('click', null);
    expect(authService.linkOrSignInWithGitHub).toHaveBeenCalled();
  });

  it('should logout', () => {
    // fake logged-in state
    let user = Object.assign({}, dummyUser);
    user.isAnonymous = false;
    spyOn(userService, 'observeUserChanges').and.returnValue(Observable.of(user));
    fixture.detectChanges();

    const menuButton = fixture.debugElement.query(By.css('[md-icon-button]'));

    // open menu
    menuButton.triggerEventHandler('click', null);

    const loginButton = fixture.debugElement.query(By.css('.mat-menu-panel button'));

    loginButton.triggerEventHandler('click', null);
    expect(authService.signOut).toHaveBeenCalled();
  });
});

