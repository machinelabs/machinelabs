import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { RemoteLabExecService } from '../remote-lab-exec.service';
import { LabStorageService } from '../lab-storage.service';
import { Observable } from 'rxjs/Observable';
import { Lab } from '../models/lab';

@Component({
  selector: 'ml-editor-view',
  templateUrl: './editor-view.component.html',
  styleUrls: ['./editor-view.component.scss']
})
export class EditorViewComponent implements OnInit {
  output: Observable<string>;
  lab: Lab;
  sidebarToggled = false;

  constructor (private rleService: RemoteLabExecService, 
               private labStorageService: LabStorageService,
               private route: ActivatedRoute,
               private router: Router) {
  }

  ngOnInit () {
    this.rleService.init();
    this.route.data.map(data => data['lab'])
              .subscribe(lab => this.lab = lab);
  }

  run(lab: Lab) {

    // Scan the notifications and build up a string with line breaks
    // Don't make this a manual subscription without dealing with 
    // Unsubscribing. The returned Observable may not auto complete
    // in all scenarios.
    this.output = this.rleService.runCode(lab.code)
                      .scan((acc, current) => `${acc}\n${current}`, '');
  }

  save(lab: Lab) {
    this.labStorageService.saveLab(lab)
        .subscribe(() => this.router.navigateByUrl(`${this.lab.id}`))
  }

  toggleSidebar() {
    this.sidebarToggled = !this.sidebarToggled;
  }

  log(value) {
    console.log(value);
  }
}
