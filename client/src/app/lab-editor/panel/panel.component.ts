import { Component, Input } from '@angular/core';

@Component({
  selector: 'ml-panel',
  template: `
    <ml-panel-title *ngIf="panelTitle">{{panelTitle}}</ml-panel-title>
    <div class="ml-panel-content">
      <ng-content></ng-content>
    </div>
  `,
  styleUrls: ['./panel.component.scss']
})
export class PanelComponent {
  @Input() panelTitle: string;
}
