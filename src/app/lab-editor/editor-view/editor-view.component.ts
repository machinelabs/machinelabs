import { Component, OnInit, ViewChild } from '@angular/core';
import { Location } from '@angular/common';
import { Router, ActivatedRoute, UrlSerializer } from '@angular/router';
import { MdDialog, MdDialogRef, MdSnackBar, MdTabGroup, MdSidenav } from '@angular/material';
import { AceEditorComponent } from '../ace-editor/ace-editor.component';
import { FileNameDialogComponent } from '../file-name-dialog/file-name-dialog.component';
import { EditLabDialogComponent } from '../edit-lab-dialog/edit-lab-dialog.component';
import { NavigationConfirmDialogComponent } from '../navigation-confirm-dialog/navigation-confirm-dialog.component';
import { RejectionDialogComponent } from '../rejection-dialog/rejection-dialog.component';
import { RemoteLabExecService } from '../remote-code-execution/remote-lab-exec.service';
import { EditorSnackbarService } from '../editor-snackbar.service';
import { LabStorageService } from '../../lab-storage.service';
import { UserService } from '../../user/user.service';
import { User } from '../../models/user';
import { BLANK_LAB_TPL_ID } from '../../lab-template.service';
import { Observable } from 'rxjs/Observable';
import { Lab, LabExecutionContext, File } from '../../models/lab';
import {
  ExecutionMessage,
  MessageKind,
  ClientExecutionState,
  ExecutionRejectionInfo,
  ExecutionRejectionReason
} from '../../models/execution';
import { EditorToolbarAction, EditorToolbarActionTypes } from '../editor-toolbar/editor-toolbar.component';

enum TabIndex {
  Editor,
  Console,
  Settings
}

interface EditLabDialogOptions {
  hideCancelButton: boolean;
}

const METADATA_SIDEBAR_OPEN_TIMEOUT = 600;
const EXECUTION_START_TIMEOUT = 5000;

@Component({
  selector: 'ml-editor-view',
  templateUrl: './editor-view.component.html',
  styleUrls: ['./editor-view.component.scss']
})
export class EditorViewComponent implements OnInit {

  output: Observable<string>;

  lab: Lab;

  user: Observable<User>;

  context: LabExecutionContext;

  sidebarToggled = false;

  activeFile: File;

  fileNameDialogRef: MdDialogRef<FileNameDialogComponent>;

  navigationConfirmDialogRef: MdDialogRef<NavigationConfirmDialogComponent>;

  @ViewChild(MdTabGroup) tabGroup: MdTabGroup;

  @ViewChild('executionMetadataSidebar') executionMetadataSidebar: MdSidenav;

  @ViewChild('outputPanel') outputPanel: AceEditorComponent;

  editLabDialogRef: MdDialogRef<EditLabDialogComponent>;

  rejectionDialogRef: MdDialogRef<RejectionDialogComponent>;

  selectedTab = TabIndex.Editor;

  TabIndex = TabIndex;

  constructor (private rleService: RemoteLabExecService,
               private labStorageService: LabStorageService,
               private route: ActivatedRoute,
               private dialog: MdDialog,
               private editorSnackbar: EditorSnackbarService,
               private location: Location,
               private urlSerializer: UrlSerializer,
               private router: Router,
               private userService: UserService) {
  }

  ngOnInit () {
    this.context = new LabExecutionContext();
    this.route.data.map(data => data['lab'])
              .subscribe(lab =>  this.initLab(lab));

    this.user = this.userService.observeUserChanges();
  }

  toolbarAction(action: EditorToolbarAction) {
    switch (action.type) {
      case EditorToolbarActionTypes.Run: this.run(action.data); break;
      case EditorToolbarActionTypes.Edit: this.edit(action.data); break;
      case EditorToolbarActionTypes.Save: this.save(action.data); break;
      case EditorToolbarActionTypes.Fork: this.fork(action.data); break;
      case EditorToolbarActionTypes.Create: this.create(); break;
    }
  }

  selectTab(tabIndex: TabIndex) {
    this.selectedTab = tabIndex;
  }

  run(lab: Lab) {

    // First check if this lab is already persisted or not. We don't want to
    // execute labs that don't exist in the database.
    this.labStorageService.labExists(lab.id)
        .switchMap(exists => exists ? Observable.of(null) :
            // If it doesn't exist yet, we save it first and make sure to update
            // the url accordingly, so it can be easily shared. We can't use
            // router.navigate() here because it will perform a full navigation
            // cycle as gonig from /editor to /editor/:id is a route change.
            this.labStorageService.saveLab(lab)
                .do(_ => this.goToLab(lab))
        )
        .subscribe(() => {
          this.outputPanel.clear();
          this.selectTab(TabIndex.Console);
          // we want to have this immutable. Shared instances make it hard
          // to reason about things when code is executed asynchronously.
          // E.g. if some async handler has a reference to a context it needs
          // to be sure that the id won't change because someone started a new
          // run in between.
          // However, we want to give information about the previous context to
          // the rleService, hence we clone the current context and pass it on.
          this.context = this.context.clone();
          this.context.clientExecutionState = ClientExecutionState.Executing;
          // Scan the notifications and build up a string with line breaks
          // Don't make this a manual subscription without dealing with
          // Unsubscribing. The returned Observable may not auto complete
          // in all scenarios.
          let messages = this.rleService.run(this.context, lab);

          this.output = messages.do(msg => {
                            if (msg.kind === MessageKind.ExecutionFinished) {
                              this.context.clientExecutionState = ClientExecutionState.NotExecuting;
                              this.editorSnackbar.notifyExecutionFinished();
                            } else if (msg.kind === MessageKind.OutputRedirected) {
                              this.editorSnackbar.notifyCacheReplay(msg.data);
                            } else if (msg.kind === MessageKind.ExecutionRejected) {
                              this.context.clientExecutionState = ClientExecutionState.NotExecuting;
                              if (ExecutionRejectionInfo.isOfType(msg.data)) {
                                if (msg.data.reason === ExecutionRejectionReason.InvalidConfig) {
                                  this.editorSnackbar.notifyInvalidConfig();
                                } else {
                                  this.openRejectionDialog();
                                }
                              }
                            }
                          })
                          .filter(msg => msg.kind === MessageKind.ExecutionStarted ||
                              msg.kind === MessageKind.Stdout || msg.kind === MessageKind.Stderr)
                          .scan((acc, current) => `${acc}\n${current.data}`, '');

          Observable.timer(EXECUTION_START_TIMEOUT)
                    .takeUntil(messages)
                    .subscribe(_ => this.editorSnackbar.notifyLateExecution());

          setTimeout(() => {
            this.executionMetadataSidebar.open();
          }, METADATA_SIDEBAR_OPEN_TIMEOUT);
        });
  }

  fork(lab: Lab) {
    this.labStorageService.createLab(lab).subscribe(createdLab => {
      this.lab = createdLab;
      this.showEditDialog(createdLab, {
        hideCancelButton: true
      }).subscribe(info => {
        this.outputPanel.clear();
        // we allways need to save after forking but either the
        // version from before the dialog or the one after
        this.save(info.shouldSave ? info.lab : createdLab, 'Lab forked');
      });
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

  save(lab: Lab, msg = 'Lab saved') {
    this.labStorageService.saveLab(lab).subscribe(() => {
      this.router.navigate([lab.id], {
        queryParamsHandling: 'preserve'
      });

      this.editorSnackbar.notify(msg);
    });
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
      disableClose: false
    });

    this.navigationConfirmDialogRef.afterClosed()
      .filter(confirmed => confirmed)
      .switchMap(_ => this.labStorageService.createLab())
      .subscribe(lab => {
        this.goToLab();
        this.initLab(lab);
        this.editorSnackbar.notifyLabCreated();
      });
  }

  log(value) {
    console.log(value);
  }

  openFile(file: File) {
    this.activeFile = file;
    this.router.navigate(['.'], {
      relativeTo: this.route,
      queryParams: { file: file.name },
      queryParamsHandling: 'merge'
    });
  }

  deleteFile(file: File) {
    this.lab.directory.splice(this.lab.directory.indexOf(file), 1);
    this.openFile(this.lab.directory[0]);
  }

  updateFile(file: File, newFile: File) {
    const index = this.lab.directory.findIndex(f => f.name === file.name);
    if (index !== -1) {
      this.lab.directory[index] = newFile;
    }
  }

  openFileNameDialog(file?: File) {
    this.fileNameDialogRef = this.dialog.open(FileNameDialogComponent, {
      disableClose: false,
      data: {
        fileName: file ? file.name :  ''
      }
    });

    this.fileNameDialogRef.afterClosed()
      .filter(name => name !== '' && name !== undefined)
      .subscribe(name => {
        if (!file) {
          const newFile = { name, content: '' };
          this.lab.directory.push(newFile);
          this.openFile(newFile);
        } else {
          this.updateFile(file, { name, content: file.content});
        }
      });
  }

  openRejectionDialog() {
    this.rejectionDialogRef = this.dialog.open(RejectionDialogComponent);
  }

  initLab(lab: Lab) {
    this.lab = lab;
    this.selectTab(TabIndex.Editor);

    // try query param file name first
    const file = this.lab.directory.find(f => f.name === this.router.parseUrl(this.location.path(false)).queryParams.file);

    this.openFile(file || this.lab.directory[0]);

    if (lab.has_cached_run) {
      this.run(lab);
    }
  }

  private goToLab(lab?: Lab) {
    this.location.go(this.urlSerializer.serialize(
      this.router.createUrlTree([`${lab ? lab.id : '.'}`], {
        queryParamsHandling: 'merge',
        relativeTo: this.route
      })
    ));
  }
}
