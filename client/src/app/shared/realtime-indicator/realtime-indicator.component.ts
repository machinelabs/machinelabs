import { Component, Input } from '@angular/core';

@Component({
  selector: 'ml-realtime-indicator',
  template: `
    <div class="spinner-wrapper" *ngIf="show">
      <div class="spinner">
        <div class="circle-1"></div>
        <div class="circle-2"></div>
      </div>
      <span>REALTIME</span>
    </div>
  `,
  styleUrls: ['./realtime-indicator.component.scss']
})
export class RealtimeIndicatorComponent {
  @Input() show = true;
}
