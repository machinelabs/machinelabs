import './rx.operators';               // used for 1x import of all global RxJS transformers

import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MaterialModule} from '@angular/material';
import {FlexLayoutModule} from "@angular/flex-layout";
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

import {MachineLabsLogo} from './logo/machinelabs.logo.component';
import {PanelComponent} from './panel/panel.component';
import {AddFileDialogComponent} from './add-file-dialog/add-file-dialog.component';
import {AceEditorComponent} from './ace-editor/ace-editor.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule.forRoot(),
    FlexLayoutModule
  ],
  exports: [
    CommonModule, MaterialModule, FlexLayoutModule,
    MachineLabsLogo, PanelComponent, AddFileDialogComponent, AceEditorComponent
  ],
  declarations: [
    MachineLabsLogo,
    PanelComponent,
    AddFileDialogComponent,
    AceEditorComponent
  ],
  entryComponents: [AddFileDialogComponent]
})
export class SharedModule {
}
