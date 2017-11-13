import { Component } from '@angular/core';
import { MenuTriggerType } from '../toolbar/toolbar-menu/toolbar-menu.component';

@Component({
  selector: 'ml-landing-page',
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.scss']
})
export class LandingPageComponent {
  MenuTriggerType = MenuTriggerType;
}
