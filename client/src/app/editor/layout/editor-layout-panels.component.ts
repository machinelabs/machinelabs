import { Component } from '@angular/core';

@Component({
  selector: 'ml-editor-layout-panels',
  template: `
    <ng-content></ng-content>
  `,
  styles: [
    `
    :host {
      display: flex;
      width: 100%;
    }
  `
  ]
})
export class EditorLayoutPanelsComponent {}
