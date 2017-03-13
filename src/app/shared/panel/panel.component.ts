import { Component, Input } from '@angular/core';

@Component({
  selector: 'ml-panel',
  template: `
    <h2 class="ml-panel__title">{{panelTitle}}</h2>
    <div class="ml-panel__content">
      <ng-content></ng-content>
    </div>
  `,
  styleUrls: ['./panel.component.scss']
})
export class PanelComponent {
  @Input() panelTitle: string;
}
