import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { ToolbarModule } from '../toolbar/toolbar.module';
import { SharedModule } from '../shared/shared.module';

import { ExploreViewComponent } from './explore-view/explore-view.component';
import { ExploreLabsComponent } from './explore-labs/explore-labs.component';

@NgModule({
  imports: [
    SharedModule,
    RouterModule.forChild([
      {
        path: '',
        pathMatch: 'full',
        component: ExploreViewComponent
      }
    ]),
    ToolbarModule
  ],
  declarations: [ExploreViewComponent, ExploreLabsComponent]
})
export class ExploreModule {}
