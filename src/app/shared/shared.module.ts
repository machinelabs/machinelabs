import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MachineLabsMaterialModule } from '../ml-material.module';
import { TagListComponent } from './tag-list/tag-list.component';
import {
  DialogHeaderComponent,
  DialogContentComponent,
  DialogCtaBarComponent
} from './dialog/dialog.component';
import { TruncateWordsPipe } from './truncate-words.pipe';


@NgModule({
  declarations: [
    TagListComponent,
    DialogHeaderComponent,
    DialogContentComponent,
    DialogCtaBarComponent,
    TruncateWordsPipe
  ],
  imports: [MachineLabsMaterialModule, CommonModule],
  exports: [
    MachineLabsMaterialModule,
    TagListComponent,
    DialogHeaderComponent,
    DialogContentComponent,
    DialogCtaBarComponent,
    TruncateWordsPipe
  ]
})
export class SharedModule {}
