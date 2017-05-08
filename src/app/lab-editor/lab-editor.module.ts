import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MachineLabsMaterialModule } from '../ml-material.module';
import { SharedModule } from '../shared.module';
import { ToolbarModule } from '../toolbar/toolbar.module';

import { LabResolver } from './lab.resolver';
import { ROUTES } from './lab-editor.routes';

import { RemoteLabExecService } from './remote-code-execution/remote-lab-exec.service';
import { EditorSnackbarService } from './editor-snackbar.service';

import { EditorToolbarComponent } from './editor-toolbar/editor-toolbar.component';
import { EditorViewComponent } from './editor-view/editor-view.component';
import { AceEditorComponent } from './ace-editor/ace-editor.component';
import { PanelComponent } from './panel/panel.component';
import { PanelTitleComponent } from './panel/panel-title.component';
import { FileTreeComponent } from './file-tree/file-tree.component';
import { ExecutionStatusComponent } from './execution-status/execution-status.component';
import { ExecutionMetadataComponent } from './execution-metadata/execution-metadata.component';

import { FileNameDialogComponent } from './file-name-dialog/file-name-dialog.component';
import { NavigationConfirmDialogComponent } from './navigation-confirm-dialog/navigation-confirm-dialog.component';
import { EditLabDialogComponent } from './edit-lab-dialog/edit-lab-dialog.component';
import { RejectionDialogComponent } from './rejection-dialog/rejection-dialog.component';
import { ShareDialogComponent } from './share-dialog/share-dialog.component';

import { DistanceInWordsStrictPipe } from './distance-in-words-strict.pipe';
import { ExecutionStatusPipe } from './execution-status.pipe';

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(ROUTES),
    MachineLabsMaterialModule,
    ToolbarModule,
    SharedModule,
    ReactiveFormsModule,
    FlexLayoutModule
  ],
  declarations: [
    EditorToolbarComponent,
    EditorViewComponent,
    PanelComponent,
    PanelTitleComponent,
    AceEditorComponent,
    FileTreeComponent,
    FileNameDialogComponent,
    NavigationConfirmDialogComponent,
    EditLabDialogComponent,
    ExecutionStatusComponent,
    RejectionDialogComponent,
    ShareDialogComponent,
    DistanceInWordsStrictPipe,
    ExecutionStatusPipe,
    ExecutionMetadataComponent
  ],
  providers: [
    LabResolver,
    RemoteLabExecService,
    EditorSnackbarService
  ],
  entryComponents: [
    NavigationConfirmDialogComponent,
    EditLabDialogComponent,
    FileNameDialogComponent,
    RejectionDialogComponent,
    ShareDialogComponent
  ]
})
export class LabEditorModule {}
