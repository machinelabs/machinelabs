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
  MdChipsModule
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
    MdChipsModule
  ]
})
export class MachineLabsMaterialModule {}
