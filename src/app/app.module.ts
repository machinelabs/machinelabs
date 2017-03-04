import * as firebase from 'firebase';

import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MaterialModule } from '@angular/material';
import { RouterModule } from '@angular/router';

import { RemoteLabExecService } from './remote-lab-exec.service';
import { LabStorageService } from './lab-storage.service';
import { AuthService, FirebaseAuthService, OfflineAuthService } from './auth';

import { AppComponent } from './app.component';
import { AceEditorComponent } from './ace-editor/ace-editor.component';
import { PanelComponent } from './panel/panel.component';
import { EditorViewComponent } from './editor-view/editor-view.component';
import { AddFileDialogComponent } from './add-file-dialog/add-file-dialog.component';
import { FileTreeComponent } from './file-tree/file-tree.component';

import { APP_ROUTES } from './app.routes';
import { LabResolver } from './lab.resolver';

import { environment } from '../environments/environment';
import { DATABASE } from './app.tokens';

// We need to export this factory function to make AoT happy
export function databaseFactory() {
  return firebase.initializeApp(environment.firebaseConfig).database();
}

@NgModule({
  declarations: [
    AppComponent,
    AceEditorComponent,
    PanelComponent,
    EditorViewComponent,
    AddFileDialogComponent,
    FileTreeComponent
  ],
  imports: [
    BrowserModule,
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
    { provide: DATABASE, useFactory: databaseFactory },
    { provide: AuthService, useClass: environment.offline ? OfflineAuthService : FirebaseAuthService }
  ],
  entryComponents: [AddFileDialogComponent],
  bootstrap: [AppComponent]
})
export class AppModule { }
