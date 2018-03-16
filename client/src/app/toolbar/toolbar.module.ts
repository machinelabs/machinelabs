import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MachineLabsMaterialModule } from '../ml-material.module';

import { ToolbarComponent, ToolbarContentDirective, ToolbarCtaBarDirective } from './toolbar.component';

import { ToolbarLogoComponent } from './toolbar-logo.component';
import { ToolbarMenuComponent } from './toolbar-menu/toolbar-menu.component';
import { ToolbarNavigationComponent } from './toolbar-navigation/toolbar-navigation.component';

const TOOLBAR_DIRECTIVES = [
  ToolbarComponent,
  ToolbarMenuComponent,
  ToolbarNavigationComponent,
  ToolbarContentDirective,
  ToolbarCtaBarDirective,
  ToolbarLogoComponent
];

@NgModule({
  imports: [MachineLabsMaterialModule, CommonModule, RouterModule],
  declarations: TOOLBAR_DIRECTIVES,
  exports: TOOLBAR_DIRECTIVES
})
export class ToolbarModule {}
