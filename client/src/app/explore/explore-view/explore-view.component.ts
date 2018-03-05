import { Component, OnInit } from '@angular/core';

import { MenuTriggerType } from '../../toolbar/toolbar-menu/toolbar-menu.component';

@Component({
  selector: 'ml-explore-view',
  templateUrl: './explore-view.component.html',
  styleUrls: ['./explore-view.component.scss']
})
export class ExploreViewComponent {

  MenuTriggerType = MenuTriggerType;
}
