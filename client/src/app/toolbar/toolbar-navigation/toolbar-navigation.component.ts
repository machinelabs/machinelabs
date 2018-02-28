import { Component, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'ml-toolbar-navigation',
  templateUrl: './toolbar-navigation.component.html',
  styleUrls: ['./toolbar-navigation.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ToolbarNavigationComponent {
  opened = false;
}
