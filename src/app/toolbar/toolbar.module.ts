import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MachineLabsMaterialModule } from '../ml-material.module';

import {
  ToolbarComponent,
  ToolbarLogoComponent,
  ToolbarContentDirective,
  ToolbarCtaBarDirective
} from './toolbar.component';
import { ToolbarMenuComponent } from './toolbar-menu/toolbar-menu.component';

const TOOLBAR_DIRECTIVES = [
  ToolbarComponent,
  ToolbarLogoComponent,
  ToolbarMenuComponent,
  ToolbarContentDirective,
  ToolbarCtaBarDirective
];

@NgModule({
  imports: [
    MachineLabsMaterialModule,
    CommonModule,
    FlexLayoutModule,
    RouterModule
  ],
  declarations: TOOLBAR_DIRECTIVES,
  exports: TOOLBAR_DIRECTIVES
})
export class ToolbarModule {}
