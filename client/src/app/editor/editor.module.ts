import { NgModule } from '@angular/core';

import { AceEditorComponent } from './ace-editor/ace-editor.component';

import { EditorSnackbarService } from './editor-snackbar.service';

@NgModule({
  declarations: [
    AceEditorComponent
  ],
  providers: [
    EditorSnackbarService
  ],
  exports: [
    AceEditorComponent
  ]
})
export class EditorModule {}

