import { Component } from '@angular/core';

@Component({
  selector: 'ml-app',
  styles : [
    `:host { display: flex; height:100%; }`
  ],
  template: `
    <div fxLayout="column" fxFlex="auto">
      <router-outlet></router-outlet> 
    </div>
  `
})
export class AppComponent {
}
