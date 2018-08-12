import { Component } from '@angular/core';

@Component({
  selector: 'ml-editor-layout',
  template: '<ng-content></ng-content>',
  styles: [
    `
      :host {
        display: flex;
        flex-direction: column;
        height: 100vh;
      }
    `
  ]
})
export class EditorLayoutComponent {}
