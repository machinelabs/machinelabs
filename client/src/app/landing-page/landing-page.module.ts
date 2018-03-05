import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { SharedModule } from '../shared/shared.module';
import { ToolbarModule } from '../toolbar/toolbar.module';

import { LandingPageComponent } from './landing-page.component';

@NgModule({
  imports: [
    SharedModule,
    RouterModule.forChild([{
      path: '',
      component: LandingPageComponent
    }]),
    ToolbarModule
  ],
  declarations: [LandingPageComponent]
})
export class LandingPageModule {}
