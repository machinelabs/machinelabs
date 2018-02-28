import { Component, OnInit, HostBinding } from '@angular/core';
import { Router, NavigationStart, NavigationEnd, NavigationError, NavigationCancel } from '@angular/router';
import { SlimLoadingBarService } from 'ng2-slim-loading-bar';

declare const require: any;
const { version } = require('../../package.json');

@Component({
  selector: 'ml-app',
  template: `
    <ng2-slim-loading-bar color="#FFC107" height="3px"></ng2-slim-loading-bar>
    <router-outlet></router-outlet>
  `,
  styles: [`
    :host {
      display: block;
    }

    ng2-slim-loading-bar {
      height: 3px;
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      z-index: 6;
    }
  `]
})
export class AppComponent implements OnInit {

  @HostBinding('attr.ml-version') version = version;

  constructor(private router: Router, private slimLoadingBarService: SlimLoadingBarService) { }

  ngOnInit() {
    this.router.events
      .subscribe(event => {
        if (event instanceof NavigationStart) {
          this.slimLoadingBarService.start();
        } else if (event instanceof NavigationEnd) {
          this.slimLoadingBarService.complete();
        } else if (event instanceof NavigationError || event instanceof NavigationCancel) {
          this.slimLoadingBarService.reset();
        }
      });
  }
}
