import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MachineLabsMaterialModule } from '../ml-material.module';
import { TagListComponent } from './tag-list/tag-list.component';
import {
  DialogHeaderComponent,
  DialogContentComponent,
  DialogCtaBarComponent,
  DialogErrorComponent
} from './dialog/dialog.component';
import { TruncateWordsPipe } from './truncate-words.pipe';
import { DistanceInWordsStrictPipe } from './distance-in-words-strict.pipe';
import { DistanceInWordsToNowPipe } from './distance-in-words-to-now.pipe';
import { DigitalFormatUnitPipe } from './digital-format-unit.pipe';
import { ZippyComponent } from './zippy/zippy.component';
import { ConsoleComponent } from './console/console.component';
import { MasonryComponent } from './masonry/masonry.component';
import { MasonryItemComponent, MutationObserverFactory } from './masonry/masonry-item.component';
import { PageFooterComponent } from './page-footer/page-footer.component';
import { DurationTrackerComponent } from './duration-tracker/duration-tracker.component';
import { ExecutionCardComponent } from './execution-card/execution-card.component';
import { LabCardComponent } from './lab-card/lab-card.component';
import { ProgressBarComponent } from './progress-bar/progress-bar.component';
import { ProgressBarService } from './progress-bar/progress-bar.service';
import { RealtimeIndicatorComponent } from './realtime-indicator/realtime-indicator.component';

@NgModule({
  declarations: [
    TagListComponent,
    DialogHeaderComponent,
    DialogContentComponent,
    DialogCtaBarComponent,
    DialogErrorComponent,
    TruncateWordsPipe,
    DistanceInWordsStrictPipe,
    DistanceInWordsToNowPipe,
    DigitalFormatUnitPipe,
    ZippyComponent,
    ConsoleComponent,
    MasonryComponent,
    MasonryItemComponent,
    PageFooterComponent,
    DurationTrackerComponent,
    ExecutionCardComponent,
    LabCardComponent,
    ProgressBarComponent,
    RealtimeIndicatorComponent
  ],
  imports: [MachineLabsMaterialModule, CommonModule, RouterModule],
  exports: [
    CommonModule,
    MachineLabsMaterialModule,
    TagListComponent,
    DialogHeaderComponent,
    DialogContentComponent,
    DialogCtaBarComponent,
    DialogErrorComponent,
    TruncateWordsPipe,
    DistanceInWordsStrictPipe,
    DistanceInWordsToNowPipe,
    DigitalFormatUnitPipe,
    ZippyComponent,
    ConsoleComponent,
    MasonryComponent,
    MasonryItemComponent,
    PageFooterComponent,
    DurationTrackerComponent,
    ExecutionCardComponent,
    LabCardComponent,
    ProgressBarComponent,
    RealtimeIndicatorComponent
  ]
})
export class SharedModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: SharedModule,
      providers: [MutationObserverFactory, ProgressBarService]
    };
  }
}
