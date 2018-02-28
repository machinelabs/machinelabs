import { Component, Input } from '@angular/core';

@Component({
  selector: 'ml-toolbar-logo',
  template: `
    <a title="MachineLabs Startpage" routerLink="/">
      <picture>
        <source [srcset]="'/assets/images/machinelabs_logo_' + logoColor + '.svg'" media="(min-width: 600px)">
        <img [src]="'/assets/images/machinelabs_icon_' + iconColor + '.svg'" alt="MachineLabs, Inc.">
      </picture>
    </a>
  `,
  styleUrls: ['./toolbar-logo.component.scss']
})
export class ToolbarLogoComponent {

  iconColor = 'white';
  logoColor = 'white';

  @Input() set color(value) {
    if (value === 'primary') {
      this.iconColor = 'blue';
      this.logoColor = 'black';
    } else if (value === 'accent') {
      this.iconColor = 'white';
      this.logoColor = 'white';
    }
  }
}


