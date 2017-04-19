import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MachineLabsMaterialModule } from '../ml-material.module';

import { ToolbarComponent, ToolbarLogoComponent } from './toolbar.component';
import { ToolbarMenuComponent } from './toolbar-menu/toolbar-menu.component';

const TOOLBAR_DIRECTIVES = [
  ToolbarComponent,
  ToolbarLogoComponent,
  ToolbarMenuComponent
];

@NgModule({
  imports: [MachineLabsMaterialModule, CommonModule],
  declarations: TOOLBAR_DIRECTIVES,
  exports: TOOLBAR_DIRECTIVES
})
export class ToolbarModule {}
