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
  MdButtonModule
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
    MdButtonModule
  ]
})
export class MachineLabsMaterialModule {}
