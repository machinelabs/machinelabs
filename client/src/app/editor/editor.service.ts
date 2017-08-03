import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';
import { Injectable } from '@angular/core';
import { UrlSerializer } from '@angular/router';
import { Location } from '@angular/common';
import { LocationHelper } from '../util/location-helper';
import { RemoteLabExecService } from './remote-code-execution/remote-lab-exec.service';
import { EditorSnackbarService } from './editor-snackbar.service';
import { LabExecutionService } from 'app/lab-execution.service';
import { LabStorageService } from '../lab-storage.service';

import { File, Lab } from '../models/lab';
import {
  MessageKind,
  ExecutionRejectionInfo,
  ExecutionRejectionReason,
  Execution,
  ExecutionStatus
} from '../models/execution';

export enum TabIndex {
  Editor,
  Console,
  Settings
}

import 'rxjs/add/operator/do';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/scan';
import 'rxjs/add/operator/startWith';
import 'rxjs/add/operator/combineLatest';

@Injectable()
export class EditorService {

  selectedTab: TabIndex;

  lab: Lab;

  latestLab: Lab;

  activeFile: File;

  private localExecutions: Map<string, Execution>;

  private localExecutions$: Subject<Map<string, Execution>>;

  activeExecutionId: string;

  constructor(
    private urlSerializer: UrlSerializer,
    private location: Location,
    private locationHelper: LocationHelper,
    private editorSnackbar: EditorSnackbarService,
    private labStorageService: LabStorageService,
    private rleService: RemoteLabExecService,
    private labExecutionService: LabExecutionService
  ) {
    this.initialize();
  }

  initialize() {
    this.selectedTab = TabIndex.Editor;
    this.lab = null;
    this.latestLab = null;
    this.activeFile = null;
    this.localExecutions = new Map<string, Execution>();
    this.localExecutions$ = new Subject<Map<string, Execution>>();
  }

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

  addLocalExecution(id: string) {

    this.localExecutions.set(id, {
      id: id,
      status: ExecutionStatus.Executing,
      started_at: Date.now()
    })

    this.localExecutions$.next(this.localExecutions);
  }

  removeLocalExecution(id: string) {
    this.localExecutions.delete(id);
    this.localExecutions$.next(this.localExecutions);
  }

  observeExecutionsForLab(lab: Lab) {
    return this.labExecutionService
        .observeExecutionsForLab(this.lab)
        .startWith([])
        .combineLatest(this.localExecutions$.startWith(new Map()), (confirmedExecutions, localExecutions) => {
          localExecutions.forEach((localExecution, index) => {
            let confirmedEx = confirmedExecutions.find(execution => execution.id === localExecution.id);
            if (confirmedEx) {
              localExecutions.delete(localExecution.id);
            } else {
              confirmedExecutions = [{
                id: localExecution.id,
                execution: Observable.of(localExecution)
              }, ...confirmedExecutions];
            }

          });
          return confirmedExecutions.map(v => v.execution);
        }).share();

  }

  saveLab(lab: Lab, msg = 'Lab saved') {
    return this.labStorageService
      .saveLab(lab)
      .do(_ => {
        const urlSegments = [`/${this.locationHelper.getRootUrlSegment()}`, lab.id];

        if (this.activeExecutionId) {
          urlSegments.push(this.activeExecutionId);
        }
        this.locationHelper.updateUrl(urlSegments, {
          queryParamsHandling: 'preserve'
        });
        this.editorSnackbar.notify(msg);
      });
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
