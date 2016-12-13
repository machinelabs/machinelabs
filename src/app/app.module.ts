import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MaterialModule } from '@angular/material';
import { RouterModule } from '@angular/router';

import { ApiService } from './api.service';
import { LabStorageService } from './lab-storage.service';
import { AppComponent } from './app.component';
import { AceEditorComponent } from './ace-editor/ace-editor.component';
import { PanelComponent } from './panel/panel.component';

@NgModule({
  declarations: [
    AppComponent,
    AceEditorComponent,
    PanelComponent
  ],
  imports: [
    BrowserModule,
    HttpModule,
    FlexLayoutModule.forRoot(),
    MaterialModule.forRoot(),
    RouterModule.forRoot([])
  ],
  providers: [ApiService, LabStorageService],
  bootstrap: [AppComponent]
})
export class AppModule { }
