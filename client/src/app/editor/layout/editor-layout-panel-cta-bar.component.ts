import { Component } from '@angular/core';

@Component({
  selector: 'ml-editor-layout-panel-cta-bar',
  template: `
    <ng-content></ng-content>
  `,
  styles: [
    `
    :host {
      width: 40px;
      box-shadow: 0 0 5px rgba(0, 0, 0, 0.24);
      z-index: 1;
    }
  `
  ]
})
export class EditorLayoutPanelCtaBarComponent {}
