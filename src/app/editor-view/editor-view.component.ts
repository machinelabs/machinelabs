import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { MdDialog, MdDialogRef, MdSnackBar } from '@angular/material';
import { FileNameDialogComponent } from '../file-name-dialog/file-name-dialog.component';
import { NavigationConfirmDialogComponent } from '../navigation-confirm-dialog/navigation-confirm-dialog.component';
import { RemoteLabExecService } from '../remote-lab-exec.service';
import { LabStorageService } from '../lab-storage.service';
import { BLANK_LAB_TPL_ID } from '../lab-template.service';
import { Observable } from 'rxjs/Observable';
import { Lab, LabExecutionContext, File } from '../models/lab';
import { ToolbarAction, ToolbarActionTypes } from '../toolbar/toolbar.component';

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

  constructor (private rleService: RemoteLabExecService,
               private labStorageService: LabStorageService,
               private route: ActivatedRoute,
               private dialog: MdDialog,
               private snackBar: MdSnackBar,
               private location: Location,
               private router: Router) {
  }

  ngOnInit () {
    this.context = new LabExecutionContext();
    this.route.data.map(data => data['lab'])
              .subscribe(lab =>  this.initLab(lab));
  }

  toolbarAction(action: ToolbarAction) {
    switch (action.type) {
      case ToolbarActionTypes.Run: this.run(action.data); break;
      case ToolbarActionTypes.Stop: this.stop(action.data); break;
      case ToolbarActionTypes.Save: this.save(action.data); break;
      case ToolbarActionTypes.Fork: this.fork(action.data); break;
      case ToolbarActionTypes.Create: this.create(); break;
    }
  }

  run(lab: Lab) {

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
                      .scan((acc, current) => `${acc}\n${current}`, '');
  }

  stop(context: LabExecutionContext) {
    this.rleService.stop(context);
  }

  fork(lab: Lab) {
    this.labStorageService.createLab(lab).subscribe(lab => {
      this.lab = lab;
      this.save(this.lab, true);
    });
  }

  save(lab: Lab, forking = false) {
    this.labStorageService.saveLab(lab).subscribe(() => {
      this.snackBar.open(`Lab ${forking ? 'forked' : 'saved' }.`, 'Dismiss', { duration: 3000 })
      this.router.navigateByUrl(`${lab.id}`);
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
        this.location.go(`/?tpl=${BLANK_LAB_TPL_ID}`);
        this.initLab(lab);
        this.snackBar.open('New lab created.', 'Dismiss', { duration: 3000 })
      })
  }

  toggleSidebar() {
    this.sidebarToggled = !this.sidebarToggled;
  }

  log(value) {
    console.log(value);
  }

  openFile(file: File) {
    this.activeFile = file;
  }

  deleteFile(file: File) {
    this.lab.files.splice(this.lab.files.indexOf(file), 1);
    this.openFile(this.lab.files[0]);
  }

  updateFile(file: File, newFile: File) {
    const index = this.lab.files.findIndex(f => f.name == file.name);
    if (index != -1) {
      this.lab.files[index] = newFile;
    }
  }

  openFileNameDialog(file?: File) {
    this.fileNameDialogRef = this.dialog.open(FileNameDialogComponent, {
      disableClose: false,
      data: {
        fileName: file ? file.name.substring(0, file.name.indexOf('.py')) : ''
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

  initLab(lab) {
    this.lab = lab;
    this.openFile(this.lab.files[0]);
  }
}
