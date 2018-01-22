import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { MatDialogModule } from '@angular/material';
import { MachineLabsMaterialModule } from '../../ml-material.module';
import { EditorModule } from '../editor.module';

import { MonacoEditorService } from 'ngx-monaco';

import { EditorService } from '../editor.service';
import { SnackbarService } from '../../snackbar.service';
import { RemoteLabExecService } from '../remote-code-execution/remote-lab-exec.service';
import { DbRefBuilder } from '../../firebase/db-ref-builder';
import { LocationHelper } from '../../util/location-helper';
import { LabStorageService } from '../../lab-storage.service';
import { LabTemplateService, InMemoryLabTemplateService } from '../../lab-template.service';
import { LabExecutionService } from '../../lab-execution.service';
import { AuthService } from '../../auth';
import { WindowRef } from '../../window-ref.service';

import { DATABASE } from '../../app.tokens';
import { DATABASE_STUB } from '../../../test-helper/stubs/database.stubs';
import { AUTH_SERVICE_STUB } from '../../../test-helper/stubs/auth.service.stubs';

@NgModule({
  imports: [
    RouterTestingModule,
    MachineLabsMaterialModule,
    MatDialogModule
  ],
  exports: [
    RouterModule,
    MachineLabsMaterialModule,
    EditorModule
  ],
  providers: [
    LocationHelper,
    LabStorageService,
    { provide: LabTemplateService, useClass: InMemoryLabTemplateService },
    WindowRef,
    EditorService,
    SnackbarService,
    RemoteLabExecService,
    LabExecutionService,
    { provide: AuthService, useValue: AUTH_SERVICE_STUB },
    { provide: DATABASE, useValue: DATABASE_STUB },
    DbRefBuilder,
    MonacoEditorService
  ]
})
export class EditorTestingModule {}
