import { NgModule, ModuleWithProviders } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { COMPLETION_PROVIDERS } from 'ngx-monaco';
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
import { NameDialogComponent } from './name-dialog/name-dialog.component';
import { XtermComponent } from './xterm/xterm.component';
import { FileOutputsComponent } from './file-outputs/file-outputs.component';
import { FileOutputsTableComponent } from './file-outputs/file-outputs-table.component';
import { FilePreviewDialogToolbarComponent } from './file-preview/file-preview-dialog-toolbar/file-preview-dialog-toolbar.component';
import { FilePreviewDialogComponent } from './file-preview/file-preview-dialog/file-preview-dialog.component';

import { EditorService } from './editor.service';
import { NameDialogService } from './name-dialog/name-dialog-service';

import { RemoteLabExecService } from './remote-code-execution/remote-lab-exec.service';
import { FilePreviewDialogService } from './file-preview/file-preview-dialog.service';

import { FileTreeService } from './file-tree/file-tree.service';

import { LabConfigCompletionProvider } from './completion-providers/lab-config-completion-provider/lab-config-completion-provider';

import { ClipboardModule } from 'ngx-clipboard';

@NgModule({
  imports: [SharedModule, ReactiveFormsModule, ClipboardModule],
  declarations: [
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
    FileOutputsComponent,
    FileOutputsTableComponent,
    FilePreviewDialogComponent,
    FilePreviewDialogToolbarComponent,
    NameDialogComponent
  ],
  providers: [FileTreeService, EditorService, NameDialogService, RemoteLabExecService, FilePreviewDialogService],
  exports: [
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
    FileOutputsComponent,
    FilePreviewDialogComponent,
    FilePreviewDialogToolbarComponent
  ],
  entryComponents: [FilePreviewDialogComponent, NameDialogComponent]
})
export class EditorModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: EditorModule,
      providers: [{ provide: COMPLETION_PROVIDERS, useClass: LabConfigCompletionProvider, multi: true }]
    };
  }
}
