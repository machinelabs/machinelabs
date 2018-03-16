import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MonacoEditorModule } from 'ngx-monaco';

import { MachineLabsMaterialModule } from '../ml-material.module';
import { SharedModule } from '../shared/shared.module';
import { ToolbarModule } from '../toolbar/toolbar.module';
import { EditorModule } from '../editor/editor.module';

import { EmbeddedEditorToolbarComponent } from './embedded-editor-toolbar/embedded-editor-toolbar.component';
import { EmbeddedEditorViewComponent } from './embedded-editor-view/embedded-editor-view.component';
import { NoExecutionDialogComponent } from './no-execution-dialog/no-execution-dialog.component';

import { EMBEDDED_EDITOR_ROUTES } from './embedded-editor.routes';

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(EMBEDDED_EDITOR_ROUTES),
    MachineLabsMaterialModule,
    SharedModule,
    ToolbarModule,
    EditorModule,
    MonacoEditorModule
  ],
  declarations: [EmbeddedEditorToolbarComponent, EmbeddedEditorViewComponent, NoExecutionDialogComponent],
  entryComponents: [NoExecutionDialogComponent]
})
export class EmbeddedEditorModule {}
