import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MaterialModule } from '@angular/material';
import { RouterModule } from '@angular/router';

import { RemoteLabExecService } from './remote-lab-exec.service';
import { LabStorageService } from './lab-storage.service';

import { AppComponent } from './app.component';
import { AceEditorComponent } from './ace-editor/ace-editor.component';
import { PanelComponent } from './panel/panel.component';
import { EditorViewComponent } from './editor-view/editor-view.component';

import { APP_ROUTES } from './app.routes';
import { LabResolver } from './lab.resolver';

@NgModule({
  declarations: [
    AppComponent,
    AceEditorComponent,
    PanelComponent,
    EditorViewComponent
  ],
  imports: [
    BrowserModule,
    HttpModule,
    FlexLayoutModule.forRoot(),
    MaterialModule.forRoot(),
    RouterModule.forRoot(APP_ROUTES)
  ],
  providers: [RemoteLabExecService, LabStorageService, LabResolver],
  bootstrap: [AppComponent]
})
export class AppModule { }
