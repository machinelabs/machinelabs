import { NgModule } from '@angular/core';

import { AceEditorComponent } from './ace-editor/ace-editor.component';

import { EditorService } from './editor.service';
import { RemoteLabExecService } from './remote-code-execution/remote-lab-exec.service';
import { EditorSnackbarService } from './editor-snackbar.service';

@NgModule({
  declarations: [
    AceEditorComponent
  ],
  providers: [
    EditorService,
    RemoteLabExecService,
    EditorSnackbarService
  ],
  exports: [
    AceEditorComponent
  ]
})
export class EditorModule {}

