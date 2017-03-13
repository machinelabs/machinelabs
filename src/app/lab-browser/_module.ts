import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {SharedModule} from '../shared/_module';

import {LabBrowserComponent} from './lab-browser.component';
import {LabToolbarComponent} from './lab-toolbar/lab-toolbar.component';
import {LabFooterComponent} from './lab-footer/lab-footer.component';
import {CodeEditorComponent} from './code-editor/code-editor.component';
import {LabNavigatorComponent} from './project-navigator/project-navigator.component';
import {FileTreeComponent} from './file-tree/file-tree.component';

@NgModule({
  declarations: [
    LabBrowserComponent,
    LabToolbarComponent,
    LabNavigatorComponent,
    CodeEditorComponent,
    LabFooterComponent,
    FileTreeComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule
  ]
})
export class LabBrowserModule {
}
