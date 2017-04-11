import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'ml-panel-title',
  template: `
    <ng-content></ng-content>
  `,
  styleUrls: ['./panel-title.component.scss']
})
export class PanelTitleComponent {}
