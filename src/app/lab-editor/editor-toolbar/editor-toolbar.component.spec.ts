import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { MachineLabsMaterialModule } from '../../ml-material.module';
import { SharedModule } from '../../shared/shared.module';
import { AuthService, dummyUser } from '../../auth/';
import { EditorToolbarComponent, EditorToolbarActionTypes } from './editor-toolbar.component';
import { LabExecutionContext } from '../../models/lab';
import { ExecutionStatus, ClientExecutionState } from '../../models/execution';
import { UserService } from '../../user/user.service';
import { DbRefBuilder } from '../../firebase/db-ref-builder';
import { DATABASE } from '../../app.tokens';
import { FirebaseMock } from '../../../test-helper/firebase-mock';
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
  directory: [],
  has_cached_run: false
};

let routerStub = {
  navigateByUrl: (str) => {}
};

let activatedRouteStub = {
  snapShot: {},
  params: {},
  data: {}
};

describe('EditorToolbarComponent', () => {
  let component: EditorToolbarComponent;
  let fixture: ComponentFixture<EditorToolbarComponent>;
  let authService: AuthService;
  let userService: UserService;
  let fbMock: FirebaseMock;

  beforeEach(() => {
    fbMock = new FirebaseMock();
    TestBed.configureTestingModule({
      declarations: [EditorToolbarComponent],
      imports: [
        TestModule,
        MachineLabsMaterialModule,
        CommonModule,
        FormsModule,
        SharedModule
      ],
      providers: [
        { provide: AuthService, useValue: authServiceStub },
        { provide: DATABASE, useValue: fbMock.mockDb() },
        { provide: Router, useValue: routerStub },
        { provide: ActivatedRoute, useValue: activatedRouteStub },
        DbRefBuilder,
        UserService
      ],
      schemas: [NO_ERRORS_SCHEMA]
    });

    fixture = TestBed.createComponent(EditorToolbarComponent);
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

    let nameSpan = fixture.debugElement.query(By.css('.ml-toolbar-lab-name'));

    expect(nameSpan).toBeDefined();
    expect(nameSpan.nativeElement.textContent).toEqual(lab.name);
  });

  describe('Toolbar Actions', () => {

    it('should emit run action', () => {
      let runButton = fixture.debugElement.queryAll(By.css('ml-toolbar-cta-bar button'))[0];

      component.action.subscribe(action => {
        expect(action.type).toBe(EditorToolbarActionTypes.Run);
      });

      runButton.triggerEventHandler('click', null);
    });

    it('should emit stop action', () => {
      let lab = Object.assign({}, testLab);

      component.context = new LabExecutionContext(lab);
      component.context.clientExecutionState = ClientExecutionState.Executing;
      component.context.execution.status = ExecutionStatus.Executing;
      component.lab = lab;
      fixture.detectChanges();

      // When lab is running, stop button is the first
      let stopButton = fixture.debugElement.queryAll(By.css('ml-toolbar-cta-bar button'))[0];

      component.action.subscribe(action => {
        expect(action.type).toBe(EditorToolbarActionTypes.Stop);
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
        let saveButton = fixture.debugElement.queryAll(By.css('ml-toolbar-cta-bar button'))[1];

        component.action.subscribe(action => {
          expect(action.type).toBe(EditorToolbarActionTypes.Save);
        });

        saveButton.triggerEventHandler('click', null);
        done();
      });
    });

    it('should emit fork action', () => {
      // When user doesn't own lab and lab isn't running, fork button is second
      let forkButton = fixture.debugElement.queryAll(By.css('ml-toolbar-cta-bar button'))[1];

      component.action.subscribe(action => {
        expect(action.type).toBe(EditorToolbarActionTypes.Fork);
      });

      forkButton.triggerEventHandler('click', null);
    });

    it('should emit create action', () => {
      // When user doesn't own lab and lab isn't running, add button is third
      let createButton = fixture.debugElement.queryAll(By.css('ml-toolbar-cta-bar button'))[2];

      component.action.subscribe(action => {
        expect(action.type).toBe(EditorToolbarActionTypes.Create);
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
