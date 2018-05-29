import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { MatDialog, MatDialogRef, MatSnackBar, MatTabGroup, MatDrawer } from '@angular/material';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { FormControl } from '@angular/forms';
import { MonacoFile } from 'ngx-monaco';

import { Observable, Subscription, combineLatest } from 'rxjs';
import { filter, tap, map, skip, switchMap, take, share } from 'rxjs/operators';

import { File, ExecutionRejectionReason } from '@machinelabs/models';
import { ML_YAML_FILENAME } from '@machinelabs/core';
import { XtermComponent } from '../../editor/xterm/xterm.component';
import {
  EditLabDialogComponent,
  EditLabDialogOptions,
  EditLabDialogActions
} from '../edit-lab-dialog/edit-lab-dialog.component';
import {
  NavigationConfirmDialogComponent,
  NavigationConfirmReason
} from '../navigation-confirm-dialog/navigation-confirm-dialog.component';
import { RejectionDialogComponent } from '../rejection-dialog/rejection-dialog.component';
import { EditorService, TabIndex } from '../../editor/editor.service';
import { SnackbarService } from '../../snackbar.service';
import { LabStorageService } from '../../lab-storage.service';
import { UserService } from '../../user/user.service';
import { Lab } from '../../models/lab';
import { LocationHelper } from '../../util/location-helper';
import { Execution } from '../../models/execution';
import { EditorToolbarAction, EditorToolbarActionTypes } from '../editor-toolbar/editor-toolbar.component';
import { TimeoutError, RateLimitError } from '../../editor/remote-code-execution/errors';
import { MonacoFileTypeAdapter } from '../../editor/monaco-file-type-adapter';
import { ProgressBarService } from '../../shared/progress-bar/progress-bar.service';

const METADATA_SIDEBAR_OPEN_TIMEOUT = 600;
const FILE_TREE_DRAWER_MODE_MOBILE = 'over';
const FILE_TREE_DRAWER_MODE_WEB = 'side';

@Component({
  selector: 'ml-editor-view',
  templateUrl: './editor-view.component.html',
  styleUrls: ['./editor-view.component.scss']
})
export class EditorViewComponent implements OnInit {
  output: Observable<string>;

  set lab(lab: Lab) {
    this.editorService.lab = lab;
  }

  get lab(): Lab {
    return this.editorService.lab;
  }

  set latestLab(lab: Lab) {
    this.editorService.latestLab = lab;
  }

  get latestLab(): Lab {
    return this.editorService.latestLab;
  }

  set activeFile(file: File) {
    this.editorService.activeFile = file;
  }

  get activeFile(): File {
    return this.editorService.activeFile;
  }

  get activeExecutionId(): string {
    return this.editorService.activeExecutionId;
  }

  set activeExecutionId(id: string) {
    this.editorService.activeExecutionId = id;
  }

  execution: Observable<Execution>;

  executionSubscription: Subscription;

  executions: Observable<Array<Observable<Execution>>>;

  editLabDialogRef: MatDialogRef<EditLabDialogComponent>;

  rejectionDialogRef: MatDialogRef<RejectionDialogComponent>;

  navigationConfirmDialogRef: MatDialogRef<NavigationConfirmDialogComponent>;

  @ViewChild('executionMetadataSidebar') executionMetadataSidebar: MatDrawer;

  executionMetadataSidebarToggled = false;

  fileTreeSidebarOpened = false;

  fileTreeDrawerMode = FILE_TREE_DRAWER_MODE_MOBILE;

  shouldOpenExecutionListOnInit = false;

  @ViewChild('fileTreeSidebar') fileTreeSidebar: MatDrawer;

  @ViewChild('outputPanel') outputPanel: XtermComponent;

  TabIndex = TabIndex;

  MonacoFileTypeAdapter = MonacoFileTypeAdapter;

  pauseModeControl = new FormControl(false);

  mandatoryFiles = ['main.py', ML_YAML_FILENAME];

  constructor(
    private labStorageService: LabStorageService,
    private route: ActivatedRoute,
    private dialog: MatDialog,
    private locationHelper: LocationHelper,
    private router: Router,
    public editorService: EditorService,
    private snackbarService: SnackbarService,
    private userService: UserService,
    private breakpointObserver: BreakpointObserver,
    private loadingBarService: ProgressBarService
  ) {}

  ngOnInit() {
    this.editorService.selectedTabChange.subscribe(
      tabIndex => (this.outputPanel.enabled = tabIndex === TabIndex.Console)
    );

    combineLatest(
      this.breakpointObserver.observe(Breakpoints.Tablet),
      this.breakpointObserver.observe(Breakpoints.Web)
    ).subscribe(values => {
      const isTablet = values[0];
      const isWeb = values[1];
      this.shouldOpenExecutionListOnInit = isTablet.matches || isWeb.matches;
      this.fileTreeDrawerMode =
        isTablet.matches || isWeb.matches ? FILE_TREE_DRAWER_MODE_WEB : FILE_TREE_DRAWER_MODE_MOBILE;
    });
    // Since editorServicec is stateful, we need to reinitialize it
    // every time we want a fresh use. Pretty much the same behavior
    // one would get when all the state would live in the component.
    this.editorService.initialize();
    this.activeExecutionId = this.route.snapshot.paramMap.get('executionId');
    this.route.data
      .pipe(
        map(data => data['lab']),
        // Only init lab when it's opened for the first time
        // or when switching labs.
        filter(lab => !this.lab || lab.id !== this.lab.id)
      )
      .subscribe(lab => this.initLab(lab));

    if (this.activeExecutionId) {
      this.listen(this.activeExecutionId, true, true);
    }
  }

  toolbarAction(action: EditorToolbarAction) {
    if (action.type !== EditorToolbarActionTypes.Create && action.type !== EditorToolbarActionTypes.Edit) {
      this.loadingBarService.start();
    }
    switch (action.type) {
      case EditorToolbarActionTypes.Run:
        this.run(action.data);
        break;
      case EditorToolbarActionTypes.Edit:
        this.edit(action.data);
        break;
      case EditorToolbarActionTypes.Save:
        this.save(action.data);
        break;
      case EditorToolbarActionTypes.Fork:
        this.fork(action.data);
        break;
      case EditorToolbarActionTypes.ForkAndRun:
        this.forkAndRun(action.data);
        break;
      case EditorToolbarActionTypes.Create:
        this.create(action.data);
        break;
    }
  }

  selectTab(tabIndex: TabIndex) {
    this.editorService.selectTab(tabIndex);
    if (this.editorService.consoleTabActive() && this.outputPanel) {
      setTimeout(_ => this.outputPanel.resize(), 0);
    }
  }

  forkAndRun(lab: Lab) {
    this.editorService
      .forkLab(lab)
      .pipe(switchMap(forkedLab => this.editorService.saveLab(forkedLab, 'Lab forked')))
      .subscribe(savedLab => {
        this.initLab(savedLab);
        this.run(savedLab);
      });
  }

  run(lab: Lab) {
    this.userService.getCurrentUser().subscribe(user => {
      if (user.isAnonymous) {
        this.openRejectionDialog(ExecutionRejectionReason.NoAnonymous);
        this.loadingBarService.stop();
      } else {
        this.outputPanel.reset();
        this.editorService.selectConsoleTab();

        this.latestLab = Object.assign({}, lab);

        const runInfo$ = this.editorService.executeLab(lab).pipe(share());

        runInfo$.subscribe(
          info => {
            this.editorService.addLocalExecution(info.executionId);
            this.activeExecutionId = info.executionId;
            this.openExecutionList();

            if (info.persistent) {
              this.locationHelper.updateUrl([this.locationHelper.getRootUrlSegment(), lab.id, info.executionId], {
                queryParamsHandling: 'merge'
              });
              this.listen(this.activeExecutionId, false);
              this.loadingBarService.stop();
            } else if (info.rejection) {
              this.editorService.removeLocalExecution(info.executionId);
              this.loadingBarService.stop();
              if (info.rejection.reason === ExecutionRejectionReason.InvalidConfig) {
                this.snackbarService.notifyInvalidConfig(info.rejection.message);
              } else {
                this.openRejectionDialog(info.rejection.reason);
              }
              this.activeExecutionId = null;
            }
          },
          e => {
            this.editorService.removeLocalExecution(e.executionId);
            this.loadingBarService.stop();
            if (e instanceof TimeoutError) {
              this.snackbarService.notifyServerNotAvailable();
            } else if (e instanceof RateLimitError) {
              this.snackbarService.notifyExecutionRateLimitExceeded();
            }
          }
        );

        this.snackbarService.notifyLateExecutionUnless(runInfo$.pipe(skip(1)));
      }
    });
  }

  listenAndUpdateUrl(execution: Execution) {
    this.locationHelper.updateUrl(['/editor', execution.lab.id, execution.id], {
      queryParamsHandling: 'preserve'
    });
    this.activeExecutionId = execution.id;
    this.listen(this.activeExecutionId);
  }

  listen(executionId: string, initLabDirectory = true, isInitialization = false) {
    this.outputPanel.reset();

    const wrapper = this.editorService.listenAndNotify(executionId, {
      inPauseMode: () => {
        return this.pauseModeControl.value;
      },
      pauseModeExecutionStartedAction: () => {
        this.pauseModeControl.setValue(false);
      },
      pauseModeExecutionFinishedAction: () => {
        this.pauseModeControl.setValue(false);
        this.listen(executionId);
      }
    });

    this.execution = wrapper.execution;

    if (this.executionSubscription) {
      this.executionSubscription.unsubscribe();
    }

    // The take(1) may make it seem as if we don't have to care about unsubscribing
    // but think about an Execution coming in late when the user actually has already
    // opened up a different execution. It would cause our lab contents to get overwritten
    // with the wrong files.
    this.executionSubscription = this.execution.pipe(take(1)).subscribe(execution => {
      this.loadingBarService.stop();
      if (initLabDirectory) {
        this.editorService.initDirectory(execution.lab.directory);
      }
    });

    this.output = wrapper.messages;

    if (!isInitialization || this.shouldOpenExecutionListOnInit) {
      this.openExecutionList();
    }
  }

  fork(lab: Lab) {
    this.editorService
      .forkLab(lab)
      .pipe(switchMap(createdLab => this.showEditDialog(createdLab, { hideCancelButton: true })))
      .subscribe(info => {
        this.outputPanel.reset();
        this.activeExecutionId = null;
        // we allways need to save after forking but either the
        // version from before the dialog or the one after
        this.save(info.shouldSave ? info.lab : this.lab, 'Lab forked', true);
      });
  }

  edit(lab: Lab) {
    this.showEditDialog(lab).subscribe(info => {
      if (info.action === EditLabDialogActions.Save) {
        this.save(info.lab);
      } else if (info.action === EditLabDialogActions.Delete) {
        this.delete(info.lab);
      }
    });
  }

  save(lab: Lab, msg = 'Lab saved', fetchExecutions = false) {
    this.editorService.saveLab(lab, msg).subscribe(_ => {
      this.initLab(lab, fetchExecutions, false);
      this.loadingBarService.stop();
    });
  }

  delete(lab: Lab) {
    this.editorService.deleteLab(lab).subscribe(_ => this.router.navigate(['/editor']));
  }

  showEditDialog(
    lab: Lab,
    options: EditLabDialogOptions = {
      hideCancelButton: false
    }
  ) {
    this.editLabDialogRef = this.dialog.open(EditLabDialogComponent, {
      disableClose: false,
      data: {
        lab: lab,
        options
      }
    });

    return this.editLabDialogRef.afterClosed().pipe(
      // if it doesn't have an info it was closed by ESC
      // TODO: any way to handle this from inside the EditDialog?
      map(info => info || { shouldSave: false, lab: null }),
      tap(info => {
        if (info.shouldSave) {
          this.lab = info.lab;
        }
      })
    );
  }

  create(labTemplate?: string) {
    this.navigationConfirmDialogRef = this.dialog.open(NavigationConfirmDialogComponent, {
      disableClose: false,
      data: {
        reason: NavigationConfirmReason.UnsavedChanges
      }
    });

    this.navigationConfirmDialogRef
      .afterClosed()
      .pipe(
        filter(confirmed => confirmed),
        switchMap(
          _ =>
            labTemplate ? this.labStorageService.createLabFromTemplate(labTemplate) : this.labStorageService.createLab()
        )
      )
      .subscribe(lab => {
        this.outputPanel.reset();
        this.goToLab();
        this.initLab(lab);
        this.snackbarService.notifyLabCreated();
      });
  }

  scrollToBottom() {
    this.outputPanel.scrollToBottom();
  }

  log(value) {
    console.log(value);
  }

  openRejectionDialog(rejectionReason: ExecutionRejectionReason) {
    this.rejectionDialogRef = this.dialog.open(RejectionDialogComponent, {
      data: { rejectionReason }
    });
  }

  initLab(lab: Lab, fetchExecutions = true, collapseDirectories = true) {
    this.editorService.initLab(lab, collapseDirectories);
    if (fetchExecutions) {
      this.initExecutionList();
    }
  }

  private initExecutionList() {
    this.executions = this.editorService.observeExecutionsForLab(this.lab);
    this.executions.pipe(take(1), filter(executions => !!executions.length)).subscribe(_ => {
      if (this.shouldOpenExecutionListOnInit) {
        this.openExecutionList();
      }
      if (this.activeExecutionId && !this.route.snapshot.queryParamMap.get('tab')) {
        this.editorService.selectConsoleTab();
      }
    });
  }

  restoreLab() {
    this.editorService.selectEditorTab();
    this.outputPanel.reset();
    this.activeExecutionId = null;
    this.locationHelper.updateUrl(['/editor', this.lab.id], {
      queryParamsHandling: 'merge'
    });
    this.editorService.initDirectory(this.latestLab.directory);

    setTimeout(() => {
      this.executionMetadataSidebar.close();
      this.snackbarService.notifyExecutionUnselected();
    }, METADATA_SIDEBAR_OPEN_TIMEOUT);
  }

  onFileChange(file: MonacoFile) {
    this.activeFile.content = file.content;
  }

  openFile(file: File, path?: string) {
    this.editorService.openFile(file, path);
    if (this.fileTreeDrawerMode === FILE_TREE_DRAWER_MODE_MOBILE) {
      this.fileTreeSidebar.close();
    }
  }

  private goToLab(lab?: Lab, queryParams?) {
    this.locationHelper.updateUrl(['/editor', `${lab ? lab.id : ''}`], {
      queryParamsHandling: 'merge',
      queryParams: queryParams || {}
    });
  }

  private openExecutionList() {
    setTimeout(() => {
      this.executionMetadataSidebar.open();
    }, METADATA_SIDEBAR_OPEN_TIMEOUT);
  }
}
