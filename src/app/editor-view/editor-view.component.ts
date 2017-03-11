import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { MdDialog, MdDialogRef } from '@angular/material';
import { AddFileDialogComponent } from '../add-file-dialog/add-file-dialog.component';
import { NavigationConfirmDialogComponent } from '../navigation-confirm-dialog/navigation-confirm-dialog.component';
import { RemoteLabExecService } from '../remote-lab-exec.service';
import { LabStorageService } from '../lab-storage.service';
import { BLANK_LAB_TPL_ID } from '../lab-template.service';
import { Observable } from 'rxjs/Observable';
import { Lab, LabExecutionContext, File } from '../models/lab';
import { User } from '../models/user';
import { AuthService } from '../auth/auth.service';

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

  addFileDialogRef: MdDialogRef<AddFileDialogComponent>;

  navigationConfirmDialogRef: MdDialogRef<NavigationConfirmDialogComponent>;

  user: User;

  constructor (private rleService: RemoteLabExecService,
               private labStorageService: LabStorageService,
               private route: ActivatedRoute,
               private dialog: MdDialog,
               private authService: AuthService,
               private location: Location,
               private router: Router) {
  }

  ngOnInit () {
    this.context = new LabExecutionContext();
    this.route.data.map(data => data['lab'])
              .subscribe(lab =>  {
                this.lab = lab;
                this.activeFile = this.lab.files[0];
              });

    this.authService.requireAuth().subscribe(user => this.user = user);
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
      this.save(this.lab);
    });
  }

  save(lab: Lab) {
    this.labStorageService.saveLab(lab)
        .subscribe(() => this.router.navigateByUrl(`${lab.id}`))
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

  openAddFileDialog() {
    this.addFileDialogRef = this.dialog.open(AddFileDialogComponent, {
      disableClose: false
    });

    this.addFileDialogRef.afterClosed()
      .filter(filename => filename !== '' && filename !== undefined)
      .subscribe(filename => {
        const file = { name: filename, content: '' };
        this.lab.files.push(file);
        this.openFile(file);
      });
  }

  loginWithGitHub() {
    this.authService.linkOrSignInWithGitHub().subscribe();
  }

  logout() {
    this.authService.signOut().subscribe();
  }

  initLab(lab) {
    this.lab = lab;
    this.openFile(this.lab.files[0]);
  }
}
