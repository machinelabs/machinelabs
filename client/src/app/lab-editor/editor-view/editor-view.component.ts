import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { MdDialog, MdDialogRef, MdSnackBar, MdTabGroup, MdSidenav } from '@angular/material';
import { AceEditorComponent } from '../../editor/ace-editor/ace-editor.component';
import { EditLabDialogComponent, EditLabDialogOptions } from '../edit-lab-dialog/edit-lab-dialog.component';
import {
  NavigationConfirmDialogComponent,
  NavigationConfirmReason
} from '../navigation-confirm-dialog/navigation-confirm-dialog.component';
import { RejectionDialogComponent } from '../rejection-dialog/rejection-dialog.component';
import { EditorService, TabIndex } from '../../editor/editor.service';
import { EditorSnackbarService } from '../../editor/editor-snackbar.service';
import { LabStorageService } from '../../lab-storage.service';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import { Lab, File } from '../../models/lab';
import { Directory } from '../../util/directory';
import { SlimLoadingBarService } from 'ng2-slim-loading-bar';
import { LocationHelper } from '../../util/location-helper';
import { Execution, ExecutionRejectionReason } from '../../models/execution';
import { EditorToolbarAction, EditorToolbarActionTypes } from '../editor-toolbar/editor-toolbar.component';

import 'rxjs/add/observable/of';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/skip';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/take';
import 'rxjs/add/operator/share';

const METADATA_SIDEBAR_OPEN_TIMEOUT = 600;
const EXECUTION_START_TIMEOUT = 5000;
const INITIAL_LOADING_INDICATOR_PROGRESS = 10;

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

  editLabDialogRef: MdDialogRef<EditLabDialogComponent>;

  rejectionDialogRef: MdDialogRef<RejectionDialogComponent>;

  navigationConfirmDialogRef: MdDialogRef<NavigationConfirmDialogComponent>;

  sidebarToggled = false;

  @ViewChild('executionMetadataSidebar') executionMetadataSidebar: MdSidenav;

  @ViewChild('outputPanel') outputPanel: AceEditorComponent;

  @ViewChild('editor') editor: AceEditorComponent;

  TabIndex = TabIndex;

  constructor (private labStorageService: LabStorageService,
               private route: ActivatedRoute,
               private dialog: MdDialog,
               private locationHelper: LocationHelper,
               private router: Router,
               public editorService: EditorService,
               private editorSnackbar: EditorSnackbarService,
               private slimLoadingBarService: SlimLoadingBarService) {
  }

  ngOnInit () {
    // Since editorServicec is stateful, we need to reinitialize it
    // every time we want a fresh use. Pretty much the same behavior
    // one would get when all the state would live in the component.
    this.editorService.initialize();
    this.activeExecutionId = this.route.snapshot.paramMap.get('executionId');
    this.route.data.map(data => data['lab'])
              // Only init lab when it's opened for the first time
              // or when switching labs.
              .filter(lab => !this.lab || lab.id !== this.lab.id)
              .subscribe(lab => this.initLab(lab));

    if (this.activeExecutionId) {
      this.listen(this.activeExecutionId);
    }
  }

  toolbarAction(action: EditorToolbarAction) {
    switch (action.type) {
      case EditorToolbarActionTypes.Run: this.run(action.data); break;
      case EditorToolbarActionTypes.Edit: this.edit(action.data); break;
      case EditorToolbarActionTypes.Save: this.save(action.data); break;
      case EditorToolbarActionTypes.Fork: this.fork(action.data); break;
      case EditorToolbarActionTypes.ForkAndRun: this.forkAndRun(action.data); break;
      case EditorToolbarActionTypes.Create: this.create(); break;
    }
  }

  selectTab(tabIndex: TabIndex) {
    this.editorService.selectTab(tabIndex);
    if (this.editorService.editorTabActive() && this.editor) {
      // This has to run in the next tick after the editor has become visible
      // https://github.com/ajaxorg/ace/issues/3070
      setTimeout(_ => this.editor.resize(), 0);
    } else if (this.editorService.consoleTabActive() && this.outputPanel) {
      setTimeout(_ => this.outputPanel.resize(), 0);
    }
  }

  forkAndRun(lab: Lab) {
    this.editorService
      .forkLab(lab)
      .switchMap(forkedLab => this.editorService.saveLab(forkedLab, 'Lab forked'))
      .subscribe(savedLab => {
        this.initLab(savedLab);
        this.run(savedLab)
      });
  }

  run(lab: Lab) {

    this.outputPanel.clear();
    this.editorService.selectConsoleTab();

    this.latestLab = Object.assign({}, lab);

    const runInfo$ = this.editorService.executeLab(lab).share();

    runInfo$.subscribe(info => {
      this.editorService.addLocalExecution(info.executionId);
      this.activeExecutionId = info.executionId;
      this.openExecutionList();

      if (info.persistent) {
        this.locationHelper.updateUrl([
          this.locationHelper.getRootUrlSegment(),
          lab.id,
          info.executionId
        ], {
          queryParamsHandling: 'merge'
        });
        this.activeExecutionId = info.executionId;
        this.listen(this.activeExecutionId);
      } else if (info.rejection) {
        this.editorService.removeLocalExecution(info.executionId);
        if (info.rejection.reason === ExecutionRejectionReason.InvalidConfig) {
          this.editorSnackbar.notifyInvalidConfig();
        } else {
          this.openRejectionDialog(info.rejection.reason);
        }
      }
    }, e => this.editorService.removeLocalExecution(e.executionId));

    this.editorSnackbar.notifyLateExecutionUnless(runInfo$.skip(1));
  }

  listenAndUpdateUrl(execution: Execution) {
    this.locationHelper.updateUrl(['/editor', execution.lab.id, execution.id], {
      queryParamsHandling: 'preserve'
    });
    this.activeExecutionId = execution.id;
    this.listen(this.activeExecutionId);
  }

  listen(executionId: string) {
    this.slimLoadingBarService.progress = INITIAL_LOADING_INDICATOR_PROGRESS;
    this.outputPanel.clear();

    let wrapper = this.editorService.listenAndNotify(executionId);
    this.execution = wrapper.execution;

    if (this.executionSubscription) {
      this.executionSubscription.unsubscribe();
    }

    // The take(1) may make it seem as if we don't have to care about unsubscribing
    // but think about an Execution coming in late when the user actually has already
    // opened up a different execution. It would cause our lab contents to get overwritten
    // with the wrong files.
    this.executionSubscription = this.execution
      .take(1)
      .subscribe(execution => {
        this.slimLoadingBarService.complete();
        this.editorService.initDirectory(execution.lab.directory);
      });

    this.output = wrapper.messages;
    this.editorSnackbar.notifyLateExecutionUnless(wrapper.messages);
    this.openExecutionList();
  }

  fork(lab: Lab) {
    this.editorService
      .forkLab(lab)
      .switchMap(createdLab => this.showEditDialog(createdLab, { hideCancelButton: true }))
      .subscribe(info => {
        this.outputPanel.clear();
        this.activeExecutionId = null;
        // we allways need to save after forking but either the
        // version from before the dialog or the one after
        this.save(info.shouldSave ? info.lab : this.lab, 'Lab forked', true);
      });
  }

  edit(lab: Lab) {
    this.showEditDialog(lab)
        .subscribe(info => {
          if (info.shouldSave) {
            this.save(info.lab);
          }
        });
  }

  save(lab: Lab, msg = 'Lab saved', fetchExecutions = false) {
    this.editorService
        .saveLab(lab, msg)
        .subscribe(_ => this.initLab(lab, fetchExecutions));
  }

  showEditDialog(lab: Lab, options: EditLabDialogOptions = {
    hideCancelButton: false
  }) {
    this.editLabDialogRef = this.dialog.open(EditLabDialogComponent, {
          disableClose: false,
          data: {
            lab: lab,
            options
          }
        });

    return this.editLabDialogRef
            .afterClosed()
            // if it doesn't have an info it was closed by ESC
            // TODO: any way to handle this from inside the EditDialog?
            .map(info => info || { shouldSave: false, lab: null })
            .do(info => {
              if (info.shouldSave) {
                this.lab = info.lab;
              }
            });
  }

  create() {
    this.navigationConfirmDialogRef = this.dialog.open(NavigationConfirmDialogComponent, {
      disableClose: false,
      data: {
        reason: NavigationConfirmReason.UnsavedChanges
      }
    });

    this.navigationConfirmDialogRef.afterClosed()
      .filter(confirmed => confirmed)
      .switchMap(_ => this.labStorageService.createLab())
      .subscribe(lab => {
        this.outputPanel.clear();
        this.goToLab();
        this.initLab(lab);
        this.editorSnackbar.notifyLabCreated();
      });
  }

  log(value) {
    console.log(value);
  }

  openRejectionDialog(rejectionReason: ExecutionRejectionReason) {
    this.rejectionDialogRef = this.dialog.open(RejectionDialogComponent, {
      data: { rejectionReason }
    });
  }

  initLab(lab: Lab, fetchExecutions = true) {
    this.editorService.initLab(lab);
    this.selectTab(TabIndex.Editor);
    if (fetchExecutions) {
      this.initExecutionList();
    }
  }

  private initExecutionList() {
    this.executions = this.editorService.observeExecutionsForLab(this.lab);
    this.executions
        .take(1)
        .map(executions => executions.length > 0 ? executions[0] : null)
        .filter(obsExecution => !!obsExecution)
        .do(_ => this.openExecutionList())
        .subscribe(_ => {
          if (this.activeExecutionId) {
            this.editorService.selectConsoleTab();
          }
        });
  }

  restoreLab() {
    this.editorService.selectEditorTab();
    this.outputPanel.clear();
    this.activeExecutionId = null;
    this.locationHelper.updateUrl(['/editor', this.lab.id], {
      queryParamsHandling: 'merge'
    });
    this.editorService.initDirectory(this.latestLab.directory);

    setTimeout(() => {
      this.executionMetadataSidebar.close();
      this.editorSnackbar.notifyLabRestored();
    }, METADATA_SIDEBAR_OPEN_TIMEOUT);
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
