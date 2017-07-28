import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';

import { EditorLayoutComponent } from './layout/editor-layout.component';
import { EditorLayoutHeaderComponent } from './layout/editor-layout-header.component';
import { EditorLayoutNavbarComponent } from './layout/editor-layout-nav-bar.component';
import { EditorLayoutMainComponent } from './layout/editor-layout-main.component';
import { EditorLayoutPanelsComponent } from './layout/editor-layout-panels.component';
import { EditorLayoutPanelComponent } from './layout/editor-layout-panel.component';
import { EditorLayoutPanelCtaBarComponent } from './layout/editor-layout-panel-cta-bar.component';
import { EditorLayoutFooterComponent } from './layout/editor-layout-footer.component';

import { AceEditorComponent } from './ace-editor/ace-editor.component';

import { EditorService } from './editor.service';
import { RemoteLabExecService } from './remote-code-execution/remote-lab-exec.service';
import { EditorSnackbarService } from './editor-snackbar.service';

@NgModule({
  imports: [
    SharedModule,
  ],
  declarations: [
    AceEditorComponent,
    EditorLayoutComponent,
    EditorLayoutHeaderComponent,
    EditorLayoutNavbarComponent,
    EditorLayoutMainComponent,
    EditorLayoutPanelsComponent,
    EditorLayoutPanelComponent,
    EditorLayoutPanelCtaBarComponent,
    EditorLayoutFooterComponent
  ],
  providers: [
    EditorService,
    RemoteLabExecService,
    EditorSnackbarService
  ],
  exports: [
    AceEditorComponent,
    EditorLayoutComponent,
    EditorLayoutHeaderComponent,
    EditorLayoutNavbarComponent,
    EditorLayoutMainComponent,
    EditorLayoutPanelsComponent,
    EditorLayoutPanelComponent,
    EditorLayoutPanelCtaBarComponent,
    EditorLayoutFooterComponent
  ]
})
export class EditorModule {}

