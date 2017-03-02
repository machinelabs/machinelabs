import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { MdDialog, MdDialogRef } from '@angular/material';
import { AddFileDialogComponent } from '../add-file-dialog/add-file-dialog.component';
import { RemoteLabExecService } from '../remote-lab-exec.service';
import { LabStorageService } from '../lab-storage.service';
import { Observable } from 'rxjs/Observable';
import { Lab, LabExecutionContext, File } from '../models/lab';

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

  dialogRef: MdDialogRef<AddFileDialogComponent>

  constructor (private rleService: RemoteLabExecService,
               private labStorageService: LabStorageService,
               private route: ActivatedRoute,
               private dialog: MdDialog,
               private router: Router) {
  }

  ngOnInit () {
    this.context = new LabExecutionContext();
    this.rleService.init();
    this.route.data.map(data => data['lab'])
              .subscribe(lab =>  {
                this.lab = lab;
                this.activeFile = this.lab.files[0];
              });
  }

  run(lab: Lab) {

    this.context = new LabExecutionContext(lab);
    
    // Scan the notifications and build up a string with line breaks
    // Don't make this a manual subscription without dealing with
    // Unsubscribing. The returned Observable may not auto complete
    // in all scenarios.
    this.output = this.rleService.run(this.context)
                      .scan((acc, current) => `${acc}\n${current}`, '');
  }

  fork(lab: Lab) {
    this.lab = this.labStorageService.createLab(lab);
    this.save(this.lab);
  }

  save(lab: Lab) {
    this.labStorageService.saveLab(lab)
        .subscribe(() => this.router.navigateByUrl(`${lab.id}`))
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
    this.dialogRef = this.dialog.open(AddFileDialogComponent, {
      disableClose: false
    });

    this.dialogRef.afterClosed()
      .filter(filename => filename !== '' && filename !== undefined)
      .subscribe(filename => {
        const file = { name: filename, content: '' };
        this.lab.files.push(file);
        this.openFile(file);
      });
  }
}
