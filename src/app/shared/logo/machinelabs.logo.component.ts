import {Component} from '@angular/core';

@Component({
  selector : 'ml-logo',
  template : `
    Machine<span class="big">Labs</span>
  `,
  styles : [
    ` :host { font-size : 1.1em; display:flex;} `,
    ` .big { font-weight : bolder; } `
  ]
})
export class MachineLabsLogo { }
