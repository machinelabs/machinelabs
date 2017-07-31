import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'ml-panel-title',
  template: `
    <div class="ml-panel-title">
      <ng-content></ng-content>
    </div>
  `,
  styleUrls: ['./panel-title.component.scss']
})
export class PanelTitleComponent {}
