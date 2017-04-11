import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { MachineLabsMaterialModule } from '../ml-material.module';
import { AuthService, dummyUser } from '../auth/';
import { ToolbarComponent, ToolbarActionTypes } from './toolbar.component';
import { LabExecutionContext, ExecutionStatus } from '../models/lab';
import { UserService } from '../user/user.service';
import { DbRefBuilder } from '../firebase/db-ref-builder';
import { DATABASE } from '../app.tokens';
import { FirebaseMock } from '../../mocks/firebase-mock';
import { EditLabDialogComponent } from '../edit-lab-dialog/edit-lab-dialog.component';

let authServiceStub = {
  requireAuth: () => {},
  requireAuthOnce: () => {},
  linkOrSignInWithGitHub: () => {}
};

let testLab = {
  id: 'some-id',
  user_id: 'user id',
  name: 'Existing lab',
  description: '',
  tags: ['existing'],
  files: []
};

let routerStub = {
  navigateByUrl: (str) => {}
};

describe('ToolbarComponent', () => {
  let component: ToolbarComponent;
  let fixture: ComponentFixture<ToolbarComponent>;
  let authService: AuthService;
  let userService: UserService;
  let fbMock: FirebaseMock;

  beforeEach(() => {
    fbMock = new FirebaseMock();
    TestBed.configureTestingModule({
      declarations: [ToolbarComponent],
      imports: [
        TestModule,
        MachineLabsMaterialModule,
        CommonModule,
        FormsModule
      ],
      providers: [
        { provide: AuthService, useValue: authServiceStub },
        { provide: DATABASE, useValue: fbMock.mockDb() },
        { provide: Router, useValue: routerStub },
        DbRefBuilder,
        UserService
      ],
      schemas: [NO_ERRORS_SCHEMA]
    });

    fixture = TestBed.createComponent(ToolbarComponent);
    component = fixture.componentInstance;
    authService = TestBed.get(AuthService);

    let lab = Object.assign({}, testLab);
    component.context = new LabExecutionContext(lab);
    component.lab = lab;
    spyOn(authService, 'requireAuth').and.returnValue(Observable.of(dummyUser));
    spyOn(authService, 'requireAuthOnce').and.returnValue(Observable.of(dummyUser));
    fixture.detectChanges();
  });

  it('should authenticate user on initialization', () => {
    expect(authService.requireAuth).toHaveBeenCalled();
  });

  it('should render lab name', () => {
    // The user will be available in the next tick hence the setTimeout
    let lab = Object.assign({}, testLab);

    component.context = new LabExecutionContext(lab);
    component.lab = lab;
    fixture.detectChanges();

    let nameSpan = fixture.debugElement.query(By.css('.ml-toolbar__lab-name span'));

    expect(nameSpan).toBeDefined();
    expect(nameSpan.nativeElement.textContent).toEqual(lab.name);
  });

  it('should open edit lab dialog when edit button is clicked', (done) => {
    // The user will be available in the next tick hence the setTimeout
    setTimeout(_ => {
      let lab = Object.assign({}, testLab);
      // lab user id and user id have to be equal
      lab.user_id = 'some unique id';

      component.context = new LabExecutionContext(lab);
      component.lab = lab;
      fixture.detectChanges();

      spyOn(component, 'openEditLabDialog');

      let editButton = fixture.debugElement.query(By.css('.ml-toolbar__lab-name button'));
      editButton.triggerEventHandler('click', null);

      expect(component.openEditLabDialog).toHaveBeenCalledWith(lab);
      done();
    });
  });

  describe('Toolbar Actions', () => {

    it('should emit run action', () => {
      let runButton = fixture.debugElement.queryAll(By.css('.ml-toolbar__cta-bar button'))[0];

      component.action.subscribe(action => {
        expect(action.type).toBe(ToolbarActionTypes.Run);
      });

      runButton.triggerEventHandler('click', null);
    });

    it('should emit stop action', () => {
      let lab = Object.assign({}, testLab);

      component.context = new LabExecutionContext(lab);
      component.context.status = ExecutionStatus.Running;
      component.lab = lab;
      fixture.detectChanges();

      // When lab is running, stop button is the first
      let stopButton = fixture.debugElement.queryAll(By.css('.ml-toolbar__cta-bar button'))[0];

      component.action.subscribe(action => {
        expect(action.type).toBe(ToolbarActionTypes.Stop);
      });

      stopButton.triggerEventHandler('click', null);
    });

    it('should emit save action', (done) => {
      // The user will be available in the next tick hence the setTimeout
      setTimeout(() => {
        let lab = Object.assign({}, testLab);
        // lab user id and user id have to be equal
        lab.user_id = 'some unique id';

        component.context = new LabExecutionContext(lab);
        component.lab = lab;
        fixture.detectChanges();

        // When lab isn't running, save button is the second
        let saveButton = fixture.debugElement.queryAll(By.css('.ml-toolbar__cta-bar button'))[1];

        component.action.subscribe(action => {
          expect(action.type).toBe(ToolbarActionTypes.Save);
        });

        saveButton.triggerEventHandler('click', null);
        done();
      });
    });

    it('should emit fork action', () => {
      // When user doesn't own lab and lab isn't running, fork button is second
      let forkButton = fixture.debugElement.queryAll(By.css('.ml-toolbar__cta-bar button'))[1];

      component.action.subscribe(action => {
        expect(action.type).toBe(ToolbarActionTypes.Fork);
      });

      forkButton.triggerEventHandler('click', null);
    });

    it('should emit create action', () => {
      // When user doesn't own lab and lab isn't running, add button is third
      let createButton = fixture.debugElement.queryAll(By.css('.ml-toolbar__cta-bar button'))[2];

      component.action.subscribe(action => {
        expect(action.type).toBe(ToolbarActionTypes.Create);
      });

      createButton.triggerEventHandler('click', null);
    });
  });
});

@NgModule({
  imports: [CommonModule],
  declarations: [EditLabDialogComponent],
  entryComponents: [EditLabDialogComponent],
  schemas: [NO_ERRORS_SCHEMA]
})
class TestModule {}
