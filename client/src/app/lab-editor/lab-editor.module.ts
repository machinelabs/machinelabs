import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MonacoEditorModule } from 'ngx-monaco';
import { MachineLabsMaterialModule } from '../ml-material.module';
import { SharedModule } from '../shared/shared.module';
import { ToolbarModule } from '../toolbar/toolbar.module';
import { EditorModule } from '../editor/editor.module';

import { HasValidExecutionGuard } from './has-valid-execution.guard';
import { HasRunningExecutionGuard } from './has-running-execution.guard';
import { ROUTES } from './lab-editor.routes';

import { EditorToolbarComponent } from './editor-toolbar/editor-toolbar.component';
import { EditorViewComponent } from './editor-view/editor-view.component';
import { PanelComponent } from './panel/panel.component';
import { PanelTitleComponent } from './panel/panel-title.component';
import { ExecutionStatusComponent } from './execution-status/execution-status.component';
import { FooterComponent } from './editor-footer/editor-footer.component';

import { NavigationConfirmDialogComponent } from './navigation-confirm-dialog/navigation-confirm-dialog.component';
import { EditLabDialogComponent } from './edit-lab-dialog/edit-lab-dialog.component';
import { RejectionDialogComponent } from './rejection-dialog/rejection-dialog.component';
import { EmbedDialogComponent } from './embed-dialog/embed-dialog.component';
import { EditExecutionDialogComponent } from './edit-execution-dialog/edit-execution-dialog.component';

import { ExecutionStatusPipe } from './execution-status.pipe';
import { ExecutionListComponent } from './execution-list/execution-list.component';

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(ROUTES),
    MachineLabsMaterialModule,
    ToolbarModule,
    SharedModule,
    EditorModule,
    ReactiveFormsModule,
    FlexLayoutModule,
    MonacoEditorModule
  ],
  declarations: [
    EditorToolbarComponent,
    EditorViewComponent,
    PanelComponent,
    PanelTitleComponent,
    NavigationConfirmDialogComponent,
    EditLabDialogComponent,
    ExecutionStatusComponent,
    RejectionDialogComponent,
    ExecutionStatusPipe,
    FooterComponent,
    ExecutionListComponent,
    EditExecutionDialogComponent,
    EmbedDialogComponent
  ],
  providers: [HasValidExecutionGuard, HasRunningExecutionGuard],
  entryComponents: [
    NavigationConfirmDialogComponent,
    EditLabDialogComponent,
    RejectionDialogComponent,
    EditExecutionDialogComponent,
    EmbedDialogComponent
  ]
})
export class LabEditorModule {}
