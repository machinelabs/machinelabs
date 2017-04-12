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
  MdTooltipModule,
  MdCardModule
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
    MdTooltipModule,
    MdCardModule
  ]
})
export class MachineLabsMaterialModule {}
