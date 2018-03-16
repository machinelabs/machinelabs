import { Component } from '@angular/core';

@Component({
  selector: 'ml-editor-layout-nav-bar',
  template: `
    <ng-content></ng-content>
  `,
  styles: [
    `
    :host {
      z-index: 2;
      box-shadow: 0 -1px 5px rgba(0,0,0,.24);
    }
  `
  ]
})
export class EditorLayoutNavbarComponent {}
