import { NgModule } from '@angular/core';
import {
  MdDialogModule,
  MdSnackBarModule,
  MdInputModule,
  MdProgressBarModule,
  MdMenuModule,
  MdIconModule,
  MdSlideToggleModule,
  MdSidenavModule,
  MdToolbarModule,
  MdButtonModule,
  MdChipsModule,
  MdTabsModule,
  MdTooltipModule
} from '@angular/material';

@NgModule({
  exports: [
    MdDialogModule,
    MdSnackBarModule,
    MdInputModule,
    MdProgressBarModule,
    MdMenuModule,
    MdIconModule,
    MdSlideToggleModule,
    MdSidenavModule,
    MdToolbarModule,
    MdButtonModule,
    MdChipsModule,
    MdTabsModule,
    MdTooltipModule
  ]
})
export class MachineLabsMaterialModule {}
