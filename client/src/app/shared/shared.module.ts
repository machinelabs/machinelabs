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
import { DistanceInWordsStrictPipe } from './distance-in-words-strict.pipe';
import { DistanceInWordsToNowPipe } from './distance-in-words-to-now.pipe';
import { DigitalFormatUnitPipe } from './digital-format-unit.pipe';


@NgModule({
  declarations: [
    TagListComponent,
    DialogHeaderComponent,
    DialogContentComponent,
    DialogCtaBarComponent,
    TruncateWordsPipe,
    DistanceInWordsStrictPipe,
    DistanceInWordsToNowPipe,
    DigitalFormatUnitPipe
  ],
  imports: [MachineLabsMaterialModule, CommonModule],
  exports: [
    CommonModule,
    MachineLabsMaterialModule,
    TagListComponent,
    DialogHeaderComponent,
    DialogContentComponent,
    DialogCtaBarComponent,
    TruncateWordsPipe,
    DistanceInWordsStrictPipe,
    DistanceInWordsToNowPipe,
    DigitalFormatUnitPipe
  ]
})
export class SharedModule {}
