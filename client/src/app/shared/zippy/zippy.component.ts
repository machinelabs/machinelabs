import { Component, Input, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'ml-zippy',
  templateUrl: './zippy.component.html',
  styleUrls: ['./zippy.component.scss']
})
export class ZippyComponent {
  @Input() collapsed = true;
  @Input() collapsable = false;

  toggle() {
    this.collapsed = !this.collapsed;
  }

  get icon() {
    const icon = this.collapsed ? 'collapsed' : 'expanded';

    return `../../../assets/images/${icon}.svg`;
  }
}
