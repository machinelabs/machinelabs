import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MaterialModule } from '@angular/material';
import { Observable } from 'rxjs/Observable';
import { AuthService, dummyUser } from '../auth/';
import { ToolbarComponent, ToolbarActionTypes } from './toolbar.component';
import { LabExecutionContext, ExecutionStatus } from '../models/lab';

let authServiceStub = {
  requireAuth: () => {},
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

describe('ToolbarComponent', () => {
  let component: ToolbarComponent;
  let fixture: ComponentFixture<ToolbarComponent>;
  let authService: AuthService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ToolbarComponent],
      imports: [MaterialModule, CommonModule, FormsModule],
      providers: [{ provide: AuthService, useValue: authServiceStub }]
    })

    fixture = TestBed.createComponent(ToolbarComponent);
    component = fixture.componentInstance;
    authService = TestBed.get(AuthService);

    let lab = Object.assign({}, testLab);
    component.context = new LabExecutionContext(lab);
    component.lab = lab;
    spyOn(authService, 'requireAuth').and.returnValue(Observable.of(dummyUser));
    fixture.detectChanges();
  });

  it('should authenticate user on initialization', () => {
    expect(authService.requireAuth).toHaveBeenCalled();
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

    it('should emit save action', () => {
      let lab = Object.assign({}, testLab);
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
