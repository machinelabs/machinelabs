import { Component } from '@angular/core';

@Component({
  selector: 'ml-editor-layout-main',
  template: `
    <ng-content></ng-content>
  `,
  styles: [`
    :host {
      display: flex;
      flex: 1;
      flex-direction: column;
    }
  `]
})
export class EditorLayoutMainComponent {}
