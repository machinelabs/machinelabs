import { Component, OnInit, HostBinding } from '@angular/core';
import { Router, NavigationStart, NavigationEnd, NavigationError, NavigationCancel } from '@angular/router';
import { ProgressBarService } from './shared/progress-bar/progress-bar.service';

declare const require: any;
const { version } = require('../../package.json');

@Component({
  selector: 'ml-app',
  template: `
    <ml-progress-bar color="accent" mode="indeterminate"></ml-progress-bar>
    <router-outlet></router-outlet>
  `,
  styles: [
    `
      :host {
        display: block;
      }
      ml-progress-bar {
        height: 3px;
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        z-index: 6;
      }
    `
  ]
})
export class AppComponent implements OnInit {
  @HostBinding('attr.ml-version') version = version;

  constructor(private router: Router, private progressBarService: ProgressBarService) {}

  ngOnInit() {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationStart) {
        this.progressBarService.start();
      } else if (event instanceof NavigationEnd) {
        this.progressBarService.stop();
      } else if (event instanceof NavigationError || event instanceof NavigationCancel) {
        this.progressBarService.stop();
      }
    });
  }
}
