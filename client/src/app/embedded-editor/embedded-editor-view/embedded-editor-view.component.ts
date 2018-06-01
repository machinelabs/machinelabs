import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog, MatDialogRef } from '@angular/material';
import { File } from '@machinelabs/models';
import { ML_YAML_FILENAME } from '@machinelabs/core';

import { Observable } from 'rxjs';
import { take, map } from 'rxjs/operators';

import { LabExecutionService } from '../../lab-execution.service';
import { EditorService, TabIndex } from '../../editor/editor.service';
import { LocationHelper } from '../../util/location-helper';
import { Lab } from '../../models/lab';

import { XtermComponent } from '../../editor/xterm/xterm.component';
import { NoExecutionDialogComponent } from '../no-execution-dialog/no-execution-dialog.component';
import { MonacoFileTypeAdapter } from '../../editor/monaco-file-type-adapter';

@Component({
  selector: 'ml-embedded-editor-view',
  templateUrl: './embedded-editor-view.component.html',
  styleUrls: ['./embedded-editor-view.component.scss']
})
export class EmbeddedEditorViewComponent implements OnInit {
  get lab(): Lab {
    return this.editorService.lab;
  }

  get activeFile(): File {
    return this.editorService.activeFile;
  }

  executionId: string;

  output: Observable<string>;

  @ViewChild('console') console: XtermComponent;

  noExecutionDialogRef: MatDialogRef<NoExecutionDialogComponent>;

  MonacoFileTypeAdapter = MonacoFileTypeAdapter;

  mandatoryFiles = ['main.py', ML_YAML_FILENAME];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    public editorService: EditorService,
    private labExecutionService: LabExecutionService,
    private locationHelper: LocationHelper,
    private dialog: MatDialog
  ) {}

  ngOnInit() {
    this.editorService.selectedTabChange.subscribe(tabIndex => (this.console.enabled = tabIndex === TabIndex.Console));

    // Since editorServicec is stateful, we need to reinitialize it
    // every time we want a fresh use. Pretty much the same behavior
    // one would get when all the state would live in the component.
    this.editorService.initialize();
    this.executionId = this.route.snapshot.paramMap.get('executionId');
    this.route.data.pipe(map(data => data['lab'])).subscribe(lab => this.editorService.initLab(lab));

    if (!this.executionId) {
      setTimeout(_ => this.showDialog());
    } else {
      this.labExecutionService
        .executionExists(this.executionId)
        .subscribe(exists => (exists ? this.listen() : this.showDialog()));
    }
  }

  listen() {
    this.console.clear();
    const wrapper = this.editorService.listenAndNotify(this.executionId);

    wrapper.execution.pipe(take(1)).subscribe(execution => this.editorService.initDirectory(execution.lab.directory));

    this.output = wrapper.messages;
  }

  openInApp() {
    this.locationHelper.openInNewTab(['/editor', this.lab.id, this.executionId]);
  }

  private showDialog() {
    this.noExecutionDialogRef = this.dialog.open(NoExecutionDialogComponent, {
      disableClose: true
    });
  }
}
