import * as firebase from 'firebase';

import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FlexLayoutModule } from '@angular/flex-layout';
import { RouterModule, PreloadAllModules } from '@angular/router';

import { SharedModule } from './shared.module';
import { MachineLabsMaterialModule } from './ml-material.module';
import { ToolbarModule } from './toolbar/toolbar.module';

import { RemoteLabExecService } from './remote-code-execution/remote-lab-exec.service';
import { LabStorageService } from './lab-storage.service';
import { UserService } from 'app/user/user.service';
import { AuthService, FirebaseAuthService, OfflineAuthService } from './auth';
import { LabTemplateService, InMemoryLabTemplateService } from './lab-template.service';
import { EditorSnackbarService } from './editor-snackbar.service';

import { AppComponent } from './app.component';
import { EditorToolbarComponent } from './editor-toolbar/editor-toolbar.component';
import { AceEditorComponent } from './ace-editor/ace-editor.component';
import { PanelComponent } from './panel/panel.component';
import { PanelTitleComponent } from './panel/panel-title.component';
import { EditorViewComponent } from './editor-view/editor-view.component';
import { FileNameDialogComponent } from './file-name-dialog/file-name-dialog.component';
import { NavigationConfirmDialogComponent } from './navigation-confirm-dialog/navigation-confirm-dialog.component';
import { FileTreeComponent } from './file-tree/file-tree.component';
import { ExecutionStatusComponent } from './execution-status/execution-status.component';
import { EditLabDialogComponent } from './edit-lab-dialog/edit-lab-dialog.component';
import { RejectionDialogComponent } from './rejection-dialog/rejection-dialog.component';

import {
  DialogHeaderComponent,
  DialogContentComponent,
  DialogCtaBarComponent
} from './dialog/dialog.component';

import { APP_ROUTES } from './app.routes';
import { LabResolver } from './lab.resolver';

import { environment } from '../environments/environment';
import { DATABASE } from './app.tokens';
import { DbRefBuilder } from './firebase/db-ref-builder';


// We need to export this factory function to make AoT happy
export function databaseFactory() {
  return firebase.initializeApp(environment.firebaseConfig).database();
}

@NgModule({
  declarations: [
    AppComponent,
    EditorToolbarComponent,
    AceEditorComponent,
    PanelComponent,
    PanelTitleComponent,
    EditorViewComponent,
    FileNameDialogComponent,
    FileTreeComponent,
    NavigationConfirmDialogComponent,
    ExecutionStatusComponent,
    EditLabDialogComponent,
    RejectionDialogComponent,
    DialogHeaderComponent,
    DialogContentComponent,
    DialogCtaBarComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpModule,
    FormsModule,
    ReactiveFormsModule,
    FlexLayoutModule,
    SharedModule,
    RouterModule.forRoot(APP_ROUTES, { preloadingStrategy: PreloadAllModules }),
    MachineLabsMaterialModule,
    ToolbarModule
  ],
  providers: [
    RemoteLabExecService,
    LabStorageService,
    UserService,
    LabResolver,
    DbRefBuilder,
    { provide: DATABASE, useFactory: databaseFactory },
    { provide: AuthService, useClass: environment.offline ? OfflineAuthService : FirebaseAuthService },
    { provide: LabTemplateService, useClass: InMemoryLabTemplateService },
    EditorSnackbarService
  ],
  entryComponents: [
    FileNameDialogComponent,
    NavigationConfirmDialogComponent,
    EditLabDialogComponent,
    RejectionDialogComponent
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
