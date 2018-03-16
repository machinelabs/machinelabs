import { Component } from '@angular/core';

@Component({
  selector: 'ml-editor-layout-panel',
  template: `
    <ng-content></ng-content>
  `,
  styles: [
    `
    :host {
      display: flex;
      flex: 1;
      position: relative;
    }
  `
  ]
})
export class EditorLayoutPanelComponent {}
