import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';
import { Injectable, EventEmitter } from '@angular/core';
import { UrlSerializer, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { LocationHelper } from '../util/location-helper';
import { RemoteLabExecService } from './remote-code-execution/remote-lab-exec.service';
import { EditorSnackbarService } from './editor-snackbar.service';
import { LabExecutionService } from 'app/lab-execution.service';
import { LabStorageService } from '../lab-storage.service';
import { createSkipTextHelper } from './util/skip-helper';

import { File, Lab } from '../models/lab';
import {
  MessageKind,
  ExecutionRejectionInfo,
  ExecutionRejectionReason,
  Execution,
  ExecutionStatus
} from '../models/execution';

export enum TabIndex {
  Editor = 'editor',
  Console = 'console',
  Settings = 'settings',
  Outputs = 'outputs'
}

import 'rxjs/add/observable/of';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/scan';
import 'rxjs/add/operator/startWith';
import 'rxjs/add/operator/combineLatest';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/skip';

export interface ListenAndNotifyOptions {
  inPauseMode: () => boolean;
  pauseModeExecutionStartedAction?: () => void;
  pauseModeExecutionFinishedAction?: () => void;
}

@Injectable()
export class EditorService {

  selectedTabChange = new EventEmitter<TabIndex>();

  selectedTab: TabIndex;

  tabs = new Map(<[string, string][]>Object.keys(TabIndex).map(key => [TabIndex[key], key]));

  lab: Lab;

  latestLab: Lab;

  activeFile: File;

  private localExecutions: Map<string, Execution>;

  private localExecutions$: Subject<Map<string, Execution>>;

  activeExecutionId: string;

  outputMaxChars = 200000;

  constructor(
    private urlSerializer: UrlSerializer,
    private location: Location,
    private locationHelper: LocationHelper,
    private editorSnackbar: EditorSnackbarService,
    private labStorageService: LabStorageService,
    private rleService: RemoteLabExecService,
    private labExecutionService: LabExecutionService,
    private route: ActivatedRoute
  ) {
    this.initialize();
  }

  initialize() {
    const tabParam = this.urlSerializer.parse(this.location.path()).queryParams.tab;

    if (this.tabs.has(tabParam)) {
      this.selectTab(TabIndex[this.tabs.get(tabParam)]);
    } else {
      this.selectTab(TabIndex.Editor);
    }

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

  listenAndNotify(executionId: string, options?: ListenAndNotifyOptions) {
    let wrapper = this.rleService.listen(executionId);

    let genSkipText = createSkipTextHelper('character');

    this.editorSnackbar.notifyLateExecutionUnless(wrapper.controlMessages);

    wrapper.controlMessages
           .subscribe(msg => {
            if (msg.kind === MessageKind.ExecutionFinished) {
              this.editorSnackbar.notifyExecutionFinished();
            }
            if (options && options.inPauseMode()) {
              if (msg.kind === MessageKind.ExecutionStarted) {
                this.editorSnackbar.notifyExecutionStartedPauseMode().onAction()
                  .subscribe(_ => { options.pauseModeExecutionStartedAction() });
              }
              if (msg.kind === MessageKind.ExecutionFinished) {
                this.editorSnackbar.notifyExecutionFinishedPauseMode().onAction()
                  .subscribe(_ => { options.pauseModeExecutionFinishedAction() });
              }
            }
          });

    let messages = wrapper.messages
      .filter(_ => !options || !options.inPauseMode())
      .filter(msg => msg.kind === MessageKind.Stdout || msg.kind === MessageKind.Stderr)
      // We replace newlines with carriage returns to ensure all messages start
      // at the beginning of a new line. This needed when rendering messages in
      // a terminal emulation, that haven't been produced by a tty emulation.
      .map(msg => msg.terminal_mode ? <string>msg.data : (<string>msg.data).replace(/[\n]/g, '\n\r'));

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
        })
        .skip(1)
        .share();

  }

  forkLab(lab: Lab) {
    return this.labStorageService
      .createLab(lab)
      .do(createdLab => this.lab = createdLab);
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
          queryParamsHandling: 'preserve',
          queryParams: this.route.snapshot.queryParams
        });
        this.editorSnackbar.notify(msg);
      })
      .map(_ => lab);
  }

  deleteLab(lab: Lab) {
    lab.hidden = true;
    return this.labStorageService
      .saveLab(lab)
      .do(_ => this.editorSnackbar.notifyLabDeleted());
  }

  executeLab(lab: Lab) {
    return this.labStorageService
      .labExists(lab.id)
      // First check if this lab is already persisted or not. We don't want to
      // execute labs that don't exist in the database.
      .switchMap(exists => exists ? Observable.of(null) : this.labStorageService.saveLab(lab))
      .switchMap(_ => this.rleService.run(lab));
  }

  selectTab(tabIndex: TabIndex) {
    this.selectedTab = tabIndex;
    this.locationHelper.updateQueryParams(this.location.path(), {
      tab: tabIndex
    });
    this.selectedTabChange.emit(tabIndex);
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

  selectOutputsTab() {
    this.selectTab(TabIndex.Outputs);
  }

  editorTabActive() {
    return this.tabActive(TabIndex.Editor);
  }

  consoleTabActive() {
    return this.tabActive(TabIndex.Console);
  }

  outputsTabActive() {
    return this.tabActive(TabIndex.Outputs);
  }

  private initActiveFile() {
    const file = this.lab.directory
      .find(f => f.name === this.urlSerializer.parse(this.location.path()).queryParams.file);
    this.openFile(file || this.lab.directory[0]);
  }
}
