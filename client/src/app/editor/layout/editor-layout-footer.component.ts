import { Component } from '@angular/core';

@Component({
  selector: 'ml-editor-layout-footer',
  template: `
    <ng-content></ng-content>
  `,
  styles: [
    `
    :host {
      display: block;
      position: relative;
      z-index: 2;
      height: 48px;
      box-shadow: 0 -1px 5px rgba(0,0,0,.24);
    }
  `
  ]
})
export class EditorLayoutFooterComponent {}
