import { Component } from '@angular/core';

@Component({
  selector: 'ml-app',
  styles: [`
    :host {
      height: 100%;
      display: flex;
    }
  `],
  template: `
    <div fxLayout="column" fxFlex="auto">
      <router-outlet></router-outlet>
    </div>
  `
})
export class AppComponent {}
