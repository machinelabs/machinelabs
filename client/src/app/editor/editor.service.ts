import { Subject } from 'rxjs/Subject';
import { of } from 'rxjs/observable/of';
import {
  combineLatest,
  filter,
  map,
  share,
  startWith,
  skip,
  switchMap,
  tap,
  catchError
} from 'rxjs/operators';

import { Injectable, EventEmitter } from '@angular/core';
import { UrlSerializer, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';

import { MonacoEditorService } from 'ngx-monaco';

import {
  LabDirectory,
  File,
  Directory,
  instanceOfFile,
  instanceOfDirectory,
  DirectoryClientState,
  ExecutionStatus,
  MessageKind
} from '@machinelabs/models';

import { getFileFromPath } from '@machinelabs/core';

import { LocationHelper } from '../util/location-helper';
import { RemoteLabExecService } from './remote-code-execution/remote-lab-exec.service';
import { SnackbarService } from '../snackbar.service';
import { LabExecutionService } from 'app/lab-execution.service';
import { LabStorageService } from '../lab-storage.service';
import { createSkipTextHelper } from './util/skip-helper';
import { FileTreeService } from './file-tree/file-tree.service';
import { Lab } from '../models/lab';


import {
  Execution,
} from '../models/execution';

export enum TabIndex {
  Editor = 'editor',
  Console = 'console',
  Settings = 'settings',
  Outputs = 'outputs'
}

export enum LabNameTruncationWordCount {
  Mobile = 4,
  Tablet = 10,
  Web = 10
}

import { getMainFile } from 'app/util/directory';

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

  activeFilePath: string;

  private localExecutions: Map<string, Execution>;

  private localExecutions$: Subject<Map<string, Execution>>;

  activeExecutionId: string;

  outputMaxChars = 200000;

  constructor(
    private urlSerializer: UrlSerializer,
    private location: Location,
    private locationHelper: LocationHelper,
    private snackbarService: SnackbarService,
    private labStorageService: LabStorageService,
    private rleService: RemoteLabExecService,
    private labExecutionService: LabExecutionService,
    private route: ActivatedRoute,
    private monacoEditorService: MonacoEditorService,
    private fileTreeService: FileTreeService
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

  initLab(lab: Lab, collapseDirectories = true) {
    this.lab = lab;
    this.monacoEditorService.disposeModels();

    if (collapseDirectories) {
      this.fileTreeService.collapseAll(this.lab.directory);
    }

    this.latestLab = Object.assign({}, this.lab);
    this.initActiveFile();
  }

  initDirectory(directory: LabDirectory) {
    this.lab.directory = directory;
    this.monacoEditorService.disposeModels();
    this.fileTreeService.collapseAll(this.lab.directory);
    this.initActiveFile();
  }

  listen(executionId: string) {
    return this.rleService.listen(executionId);
  }

  listenAndNotify(executionId: string, options?: ListenAndNotifyOptions) {
    let wrapper = this.rleService.listen(executionId);

    let genSkipText = createSkipTextHelper('character');

    this.snackbarService.notifyLateExecutionUnless(wrapper.controlMessages);

    wrapper.controlMessages
           .subscribe(msg => {
            if (msg.kind === MessageKind.ExecutionFinished) {
              this.snackbarService.notifyExecutionFinished();
            }
            if (options && options.inPauseMode()) {
              if (msg.kind === MessageKind.ExecutionStarted) {
                this.snackbarService.notifyExecutionStartedPauseMode().onAction()
                  .subscribe(_ => { options.pauseModeExecutionStartedAction() });
              }
              if (msg.kind === MessageKind.ExecutionFinished) {
                this.snackbarService.notifyExecutionFinishedPauseMode().onAction()
                  .subscribe(_ => { options.pauseModeExecutionFinishedAction() });
              }
            }
          });

    let messages = wrapper.messages
      .pipe(
        filter(_ => !options || !options.inPauseMode()),
        filter(msg => msg.kind === MessageKind.Stdout || msg.kind === MessageKind.Stderr),
        // We replace newlines with carriage returns to ensure all messages start
        // at the beginning of a new line. This needed when rendering messages in
        // a terminal emulation, that haven't been produced by a tty emulation.
        map(msg => msg.terminal_mode ? <string>msg.data : (<string>msg.data).replace(/[\n]/g, '\n\r'))
      );

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
        .pipe(
          startWith([]),
          combineLatest(
            this.localExecutions$.pipe(startWith(new Map())),
            (confirmedExecutions, localExecutions) => {
              localExecutions.forEach((localExecution, index) => {
                let confirmedEx = confirmedExecutions.find(execution => execution.id === localExecution.id);
                if (confirmedEx) {
                  localExecutions.delete(localExecution.id);
                } else {
                  confirmedExecutions = [{
                    id: localExecution.id,
                    execution: of(localExecution)
                  }, ...confirmedExecutions];
                }

              });
              return confirmedExecutions.map(v => v.execution);
            }
          ),
          skip(1),
          share()
        );

  }

  forkLab(lab: Lab) {
    return this.labStorageService
      .createLab(lab).pipe(tap(createdLab => this.lab = createdLab));
  }

  saveLab(lab: Lab, msg = 'Lab saved') {
    return this.labStorageService
      .saveLab(lab)
      .pipe(
        tap(_ => {
          const urlSegments = [`/${this.locationHelper.getRootUrlSegment()}`, lab.id];

          if (this.activeExecutionId) {
            urlSegments.push(this.activeExecutionId);
          }

          this.locationHelper.updateUrl(urlSegments, {
            queryParamsHandling: 'merge',
            queryParams: this.locationHelper.getQueryParams(this.location.path())
          });

          this.snackbarService.notify(msg);
        }),
        map(_ => lab),
        catchError(_ => {
          this.snackbarService.notifySaveLabFailed()
          return of(null);
        })
      );
  }

  deleteLab(lab: Lab) {
    lab.hidden = true;
    return this.labStorageService
      .saveLab(lab).pipe(tap(_ => this.snackbarService.notifyLabDeleted()));
  }

  executeLab(lab: Lab) {
    return this.labStorageService
      .labExists(lab.id)
      .pipe(
        // First check if this lab is already persisted or not. We don't want to
        // execute labs that don't exist in the database.
        switchMap(exists => exists ? of(null) : this.labStorageService.saveLab(lab)),
        switchMap(_ => this.rleService.run(lab))
      );
  }

  selectTab(tabIndex: TabIndex) {
    this.selectedTab = tabIndex;
    this.locationHelper.updateQueryParams(this.location.path(), {
      tab: tabIndex
    });
    this.selectedTabChange.emit(tabIndex);
  }

  openMainFile() {
    this.openFile(getMainFile(this.lab.directory));
  }

  openFile(file: File, path?: string) {
    if (this.activeFilePath) {
      // it's important to retrieve the previousActiveFile via its path because when we
      // run an execution, we are overwriting `lab.directory` with a new directory
      // from the server. Unselecting the `activeFile` wouldn't have any effect then
      // because that file is not an instance in the `lab.directory` as the `activeFile`
      // belongs to an outdated directory.
      let previousActiveFile = getFileFromPath(this.activeFilePath, this.lab.directory);
      this.fileTreeService.unselectFile(previousActiveFile);
    }

    this.activeFile = file;
    this.activeFilePath = path || file.name;
    this.fileTreeService.selectFile(this.activeFile);

    this.locationHelper.updateQueryParams(this.location.path(), {
      file: path ? path : file.name
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
    const path = this.urlSerializer.parse(this.location.path()).queryParams.file;
    let file = path ? getFileFromPath(path, this.lab.directory) : null;
    this.openFile(file || getMainFile(this.lab.directory), file ? path : null);
  }
}
