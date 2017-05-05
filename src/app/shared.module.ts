import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MachineLabsMaterialModule } from './ml-material.module';
import { TagListComponent } from './tag-list/tag-list.component';
import {
  DialogHeaderComponent,
  DialogContentComponent,
  DialogCtaBarComponent
} from './dialog/dialog.component';


@NgModule({
  declarations: [
    TagListComponent,
    DialogHeaderComponent,
    DialogContentComponent,
    DialogCtaBarComponent
  ],
  imports: [MachineLabsMaterialModule, CommonModule],
  exports: [
    MachineLabsMaterialModule,
    TagListComponent,
    DialogHeaderComponent,
    DialogContentComponent,
    DialogCtaBarComponent
  ]
})
export class SharedModule {}
