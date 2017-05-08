import { Component, OnInit, ViewChild } from '@angular/core';
import { Location } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { MdDialog, MdDialogRef, MdSnackBar, MdTabGroup } from '@angular/material';
import { FileNameDialogComponent } from '../file-name-dialog/file-name-dialog.component';
import { EditLabDialogComponent } from '../edit-lab-dialog/edit-lab-dialog.component';
import { NavigationConfirmDialogComponent } from '../navigation-confirm-dialog/navigation-confirm-dialog.component';
import { RejectionDialogComponent } from '../rejection-dialog/rejection-dialog.component';
import { ShareDialogComponent } from '../share-dialog/share-dialog.component';
import { RemoteLabExecService } from '../remote-code-execution/remote-lab-exec.service';
import { EditorSnackbarService } from '../editor-snackbar.service';
import { LabStorageService } from '../../lab-storage.service';
import { BLANK_LAB_TPL_ID } from '../../lab-template.service';
import { Observable } from 'rxjs/Observable';
import { Lab, LabExecutionContext, File } from '../../models/lab';
import { ExecutionMessage, MessageKind } from '../../models/execution';
import { EditorToolbarAction, EditorToolbarActionTypes } from '../editor-toolbar/editor-toolbar.component';

enum TabIndex {
  Editor,
  Console
}

interface EditLabDialogOptions {
  hideCancelButton: boolean;
}

@Component({
  selector: 'ml-editor-view',
  templateUrl: './editor-view.component.html',
  styleUrls: ['./editor-view.component.scss']
})
export class EditorViewComponent implements OnInit {

  output: Observable<string>;

  lab: Lab;

  context: LabExecutionContext;

  sidebarToggled = false;

  activeFile: File;

  fileNameDialogRef: MdDialogRef<FileNameDialogComponent>;

  navigationConfirmDialogRef: MdDialogRef<NavigationConfirmDialogComponent>;

  @ViewChild(MdTabGroup) tabGroup: MdTabGroup;

  editLabDialogRef: MdDialogRef<EditLabDialogComponent>;

  rejectionDialogRef: MdDialogRef<RejectionDialogComponent>;

  shareDialogRef: MdDialogRef<ShareDialogComponent>;

  constructor (private rleService: RemoteLabExecService,
               private labStorageService: LabStorageService,
               private route: ActivatedRoute,
               private dialog: MdDialog,
               private editorSnackbar: EditorSnackbarService,
               private location: Location,
               private router: Router) {
  }

  ngOnInit () {
    this.context = new LabExecutionContext();
    this.route.data.map(data => data['lab'])
              .subscribe(lab =>  this.initLab(lab));
  }

  toolbarAction(action: EditorToolbarAction) {
    switch (action.type) {
      case EditorToolbarActionTypes.Run: this.run(action.data); break;
      case EditorToolbarActionTypes.Stop: this.stop(action.data); break;
      case EditorToolbarActionTypes.Save: this.save(action.data); break;
      case EditorToolbarActionTypes.Fork: this.fork(action.data); break;
      case EditorToolbarActionTypes.Create: this.create(); break;
      case EditorToolbarActionTypes.Edit: this.edit(action.data); break;
    }
  }

  run(lab: Lab) {
    this.tabGroup.selectedIndex = TabIndex.Console;
    // we want to have this immutable. Shared instances make it hard
    // to reason about things when code is executed asynchronously.
    // E.g. if some async handler has a reference to a context it needs
    // to be sure that the id won't change because someone started a new
    // run in between.
    // However, we want to give information about the previous context to
    // the rleService, hence we clone the current context and pass it on.
    this.context = this.context.clone();

    // Scan the notifications and build up a string with line breaks
    // Don't make this a manual subscription without dealing with
    // Unsubscribing. The returned Observable may not auto complete
    // in all scenarios.
    this.output = this.rleService.run(this.context, lab)
                      .do(msg => {
                        if (msg.kind === MessageKind.ExecutionFinished) {
                          this.editorSnackbar.notifyExecutionFinished();
                        } else if (msg.kind === MessageKind.OutputRedirected) {
                          this.editorSnackbar.notifyCacheReplay(msg.data);
                        } else if (msg.kind === MessageKind.ExecutionRejected) {
                          this.openRejectionDialog();
                        }
                      })
                      .filter(msg => msg.kind === MessageKind.Stdout || msg.kind === MessageKind.Stderr)
                      .scan((acc, current) => `${acc}\n${current.data}`, '');
  }

  stop(context: LabExecutionContext) {
    this.rleService.stop(context);
    this.editorSnackbar.notifyLabStopped();
  }

  fork(lab: Lab) {
    this.labStorageService.createLab(lab).subscribe(createdLab => {
      this.lab = createdLab;
      this.showEditDialog(createdLab, {
        hideCancelButton: true
      }).subscribe(info => {
        // we allways need to save after forking but either the
        // version from before the dialog or the one after
        this.save(info.shouldSave ? info.lab : createdLab, 'Lab forked');
      });
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

  edit(lab: Lab) {
    this.showEditDialog(lab)
        .subscribe(info => {
          if (info.shouldSave) {
            this.save(info.lab);
          }
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

  openShareDialog() {
    this.shareDialogRef = this.dialog.open(ShareDialogComponent);
  }

  create() {
    this.navigationConfirmDialogRef = this.dialog.open(NavigationConfirmDialogComponent, {
      disableClose: false
    });

    this.navigationConfirmDialogRef.afterClosed()
      .filter(confirmed => confirmed)
      .switchMap(_ => this.labStorageService.createLab())
      .subscribe(lab => {
        this.location.go(`/?tpl=${BLANK_LAB_TPL_ID}`);
        this.initLab(lab);
        this.editorSnackbar.notifyLabCreated();
      });
  }

  toggleSidebar() {
    this.sidebarToggled = !this.sidebarToggled;
  }

  log(value) {
    console.log(value);
  }

  openFile(file: File) {
    this.activeFile = file;
    this.router.navigate(['.'], {
      relativeTo: this.route,
      queryParams: { file: file.name }
    });
  }

  deleteFile(file: File) {
    this.lab.files.splice(this.lab.files.indexOf(file), 1);
    this.openFile(this.lab.files[0]);
  }

  updateFile(file: File, newFile: File) {
    const index = this.lab.files.findIndex(f => f.name === file.name);
    if (index !== -1) {
      this.lab.files[index] = newFile;
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
          this.lab.files.push(newFile);
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
    this.tabGroup.selectedIndex = TabIndex.Editor;

    // try query param file name first
    const file = this.lab.files.find(f => f.name === this.router.parseUrl(this.location.path(false)).queryParams.file);

    this.openFile(file || this.lab.files[0]);

    if (lab.has_cached_run) {
      this.run(lab);
    }
  }
}
