import * as firebase from 'firebase';

import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MaterialModule } from '@angular/material';
import { RouterModule } from '@angular/router';

import { RemoteLabExecService } from './remote-lab-exec.service';
import { LabStorageService } from './lab-storage.service';
import { AuthService, FirebaseAuthService, OfflineAuthService } from './auth';
import { LabTemplateService, InMemoryLabTemplateService } from './lab-template.service';

import { AppComponent } from './app.component';
import { ToolbarComponent } from './toolbar/toolbar.component';
import { AceEditorComponent } from './ace-editor/ace-editor.component';
import { PanelComponent } from './panel/panel.component';
import { EditorViewComponent } from './editor-view/editor-view.component';
import { FileNameDialogComponent } from './file-name-dialog/file-name-dialog.component';
import { NavigationConfirmDialogComponent } from './navigation-confirm-dialog/navigation-confirm-dialog.component';
import { FileTreeComponent } from './file-tree/file-tree.component';
import { ExecutionStatusComponent } from './execution-status/execution-status.component';

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
    ToolbarComponent,
    AceEditorComponent,
    PanelComponent,
    EditorViewComponent,
    FileNameDialogComponent,
    FileTreeComponent,
    NavigationConfirmDialogComponent,
    ExecutionStatusComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpModule,
    FormsModule,
    ReactiveFormsModule,
    FlexLayoutModule.forRoot(),
    MaterialModule.forRoot(),
    RouterModule.forRoot(APP_ROUTES)
  ],
  providers: [
    RemoteLabExecService,
    LabStorageService,
    LabResolver,
    DbRefBuilder,
    { provide: DATABASE, useFactory: databaseFactory },
    { provide: AuthService, useClass: environment.offline ? OfflineAuthService : FirebaseAuthService },
    { provide: LabTemplateService, useClass: InMemoryLabTemplateService }
  ],
  entryComponents: [
    FileNameDialogComponent,
    NavigationConfirmDialogComponent
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
