import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Observable, of } from 'rxjs';
import { MachineLabsMaterialModule } from '../../ml-material.module';
import { SharedModule } from '../../shared/shared.module';
import { AuthService, dummyUser } from '../../auth/';
import { EditorToolbarComponent, EditorToolbarActionTypes } from './editor-toolbar.component';
import { ExecutionStatus } from '@machinelabs/models';
import { UserService } from '../../user/user.service';
import { LabStorageService } from '../../lab-storage.service';
import { LabTemplateService, InMemoryLabTemplateService } from '../../lab-template.service';
import { DbRefBuilder } from '../../firebase/db-ref-builder';
import { DATABASE } from '../../app.tokens';
import { FirebaseMock } from '../../../test-helper/firebase-mock';
import { EditLabDialogComponent } from '../edit-lab-dialog/edit-lab-dialog.component';
import { AUTH_SERVICE_STUB } from '../../../test-helper/stubs/auth.service.stubs';
import { ROUTER_STUB, ACTIVATED_ROUTE_STUB } from '../../../test-helper/stubs/router.stubs';
import { LAB_STUB } from '../../../test-helper/stubs/lab.stubs';

@NgModule({
  imports: [CommonModule],
  declarations: [EditLabDialogComponent],
  entryComponents: [EditLabDialogComponent],
  schemas: [NO_ERRORS_SCHEMA]
})
class TestModule {}

describe('EditorToolbarComponent', () => {
  let component: EditorToolbarComponent;
  let fixture: ComponentFixture<EditorToolbarComponent>;
  let authService: AuthService;
  let fbMock: FirebaseMock;

  beforeEach(() => {
    fbMock = new FirebaseMock();
    TestBed.configureTestingModule({
      declarations: [EditorToolbarComponent],
      imports: [TestModule, MachineLabsMaterialModule, CommonModule, FormsModule, SharedModule],
      providers: [
        { provide: AuthService, useValue: AUTH_SERVICE_STUB },
        { provide: LabTemplateService, useClass: InMemoryLabTemplateService },
        { provide: DATABASE, useValue: fbMock.mockDb() },
        { provide: Router, useValue: ROUTER_STUB },
        { provide: ActivatedRoute, useValue: ACTIVATED_ROUTE_STUB },
        LabStorageService,
        DbRefBuilder,
        UserService
      ],
      schemas: [NO_ERRORS_SCHEMA]
    });

    fixture = TestBed.createComponent(EditorToolbarComponent);
    component = fixture.componentInstance;
    authService = TestBed.get(AuthService);

    const lab = Object.assign({}, LAB_STUB);
    component.lab = lab;
    spyOn(authService, 'requireAuth').and.returnValue(of(dummyUser));
    spyOn(authService, 'requireAuthOnce').and.returnValue(of(dummyUser));
    fixture.detectChanges();
  });

  it('should authenticate user on initialization', () => {
    expect(authService.requireAuth).toHaveBeenCalled();
  });

  it('should render lab name', () => {
    // The user will be available in the next tick hence the setTimeout
    const lab = Object.assign({}, LAB_STUB);

    component.lab = lab;
    fixture.detectChanges();

    const nameSpan = fixture.debugElement.query(By.css('.ml-editor-toolbar-lab-name'));

    expect(nameSpan).toBeDefined();
    expect(nameSpan.nativeElement.textContent).toEqual(lab.name);
  });
});
