import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { SharedModule } from '../shared/shared.module';
import { ExecutionCardComponent } from './execution-card/execution-card.component';
import { ExploreLabsComponent } from './explore-labs/explore-labs.component';
import { LabCardComponent } from './lab-card/lab-card.component';

const EXPLORE_COMPONENTS = [
  ExecutionCardComponent,
  ExploreLabsComponent,
  LabCardComponent
];

@NgModule({
  imports: [
    SharedModule,
    RouterModule
  ],
  declarations: [
    ...EXPLORE_COMPONENTS
  ],
  exports: [
    ...EXPLORE_COMPONENTS
  ]
})
export class ExploreModule { }
