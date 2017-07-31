import { Injectable } from '@angular/core';
import { UrlSerializer } from '@angular/router';
import { Location } from '@angular/common';
import { LocationHelper } from '../util/location-helper';
import { RemoteLabExecService } from './remote-code-execution/remote-lab-exec.service';
import { EditorSnackbarService } from './editor-snackbar.service';

import { File, Lab } from '../models/lab';
import {
  MessageKind,
  ExecutionRejectionInfo,
  ExecutionRejectionReason
} from '../models/execution';

export enum TabIndex {
  Editor,
  Console,
  Settings
}

import 'rxjs/add/operator/do';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/scan';

@Injectable()
export class EditorService {

  selectedTab: TabIndex;

  lab: Lab;

  latestLab: Lab;

  activeFile: File;

  constructor(
    private urlSerializer: UrlSerializer,
    private location: Location,
    private locationHelper: LocationHelper,
    private editorSnackbar: EditorSnackbarService,
    private rleService: RemoteLabExecService
  ) {}

  initLab(lab: Lab) {
    this.lab = lab;
    this.latestLab = Object.assign({}, this.lab);
    this.initActiveFile();
  }

  initDirectory(directory: Array<File>) {
    this.lab.directory = directory;
    this.initActiveFile();
  }

  listen(executionId: string) {
    return this.rleService.listen(executionId);
  }

  listenAndNotify(executionId: string) {
    let wrapper = this.rleService.listen(executionId);

    let messages = wrapper.messages
      .do(msg => {
        if (msg.kind === MessageKind.ExecutionFinished) {
          this.editorSnackbar.notifyExecutionFinished();
        }
      })
      .filter(msg => msg.kind === MessageKind.ExecutionStarted ||
          msg.kind === MessageKind.Stdout || msg.kind === MessageKind.Stderr)
      .scan((acc, current) => `${acc}\n${current.data}`, '');

    return {
      execution: wrapper.execution,
      messages: messages
    };
  }

  selectTab(tabIndex: TabIndex) {
    this.selectedTab = tabIndex;
  }

  openFile(file: File) {
    this.activeFile = file;
    this.locationHelper.updateQueryParams(this.location.path(), {
      file: file.name,
    });
  }

  tabActive(tabIndex: TabIndex) {
    return this.selectedTab === tabIndex;
  }

  selectEditorTab() {
    this.selectTab(TabIndex.Editor);
  }

  selectConsoleTab() {
    this.selectTab(TabIndex.Console);
  }

  editorTabActive() {
    return this.tabActive(TabIndex.Editor);
  }

  consoleTabActive() {
    return this.tabActive(TabIndex.Console);
  }

  private initActiveFile() {
    const file = this.lab.directory
      .find(f => f.name === this.urlSerializer.parse(this.location.path()).queryParams.file);
    this.openFile(file || this.lab.directory[0]);
  }

}
