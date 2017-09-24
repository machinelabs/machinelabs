import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../shared/shared.module';

import { EditorLayoutComponent } from './layout/editor-layout.component';
import { EditorLayoutHeaderComponent } from './layout/editor-layout-header.component';
import { EditorLayoutNavbarComponent } from './layout/editor-layout-nav-bar.component';
import { EditorLayoutMainComponent } from './layout/editor-layout-main.component';
import { EditorLayoutPanelsComponent } from './layout/editor-layout-panels.component';
import { EditorLayoutPanelComponent } from './layout/editor-layout-panel.component';
import { EditorLayoutPanelCtaBarComponent } from './layout/editor-layout-panel-cta-bar.component';
import { EditorLayoutFooterComponent } from './layout/editor-layout-footer.component';

import { FileTreeComponent } from './file-tree/file-tree.component';
import { FileListComponent } from './file-list/file-list.component';
import { FileNameDialogComponent } from './file-name-dialog/file-name-dialog.component';
import { AceEditorComponent } from './ace-editor/ace-editor.component';
import { XtermComponent } from './xterm/xterm.component';

import { EditorService } from './editor.service';
import { RemoteLabExecService } from './remote-code-execution/remote-lab-exec.service';
import { EditorSnackbarService } from './editor-snackbar.service';

@NgModule({
  imports: [
    SharedModule,
    ReactiveFormsModule
  ],
  declarations: [
    AceEditorComponent,
    XtermComponent,
    EditorLayoutComponent,
    EditorLayoutHeaderComponent,
    EditorLayoutNavbarComponent,
    EditorLayoutMainComponent,
    EditorLayoutPanelsComponent,
    EditorLayoutPanelComponent,
    EditorLayoutPanelCtaBarComponent,
    EditorLayoutFooterComponent,
    FileTreeComponent,
    FileListComponent,
    FileNameDialogComponent
  ],
  providers: [
    EditorService,
    RemoteLabExecService,
    EditorSnackbarService
  ],
  exports: [
    AceEditorComponent,
    XtermComponent,
    EditorLayoutComponent,
    EditorLayoutHeaderComponent,
    EditorLayoutNavbarComponent,
    EditorLayoutMainComponent,
    EditorLayoutPanelsComponent,
    EditorLayoutPanelComponent,
    EditorLayoutPanelCtaBarComponent,
    EditorLayoutFooterComponent,
    FileTreeComponent
  ],
  entryComponents: [
    FileNameDialogComponent
  ]
})
export class EditorModule {}

