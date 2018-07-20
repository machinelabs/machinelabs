import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { ThemePalette } from '@angular/material';
import { filter, map } from 'rxjs/operators';
import { ProgressBarEventType, ProgressBarService } from './progress-bar.service';

/**
 * As there is no export from material this type is added.
 */
type ProgressBarMode = 'determinate' | 'indeterminate' | 'buffer' | 'query';

@Component({
  selector: 'ml-progress-bar',
  template: `
      <mat-progress-bar *ngIf="isVisible" [color]="color" [mode]="mode"></mat-progress-bar>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProgressBarComponent implements OnInit {
  public isVisible = false;
  @Input() color: ThemePalette = 'accent';
  @Input() mode: ProgressBarMode = 'indeterminate';

  constructor(private progressbarService: ProgressBarService, private changeDetectorRef: ChangeDetectorRef) {}
  ngOnInit() {
    this.progressbarService.progressbarEvents
      .pipe(
        filter(event => event.eventType === ProgressBarEventType.Visible),
        map(event => event.value)
      )
      .subscribe(isVisible => {
        this.isVisible = isVisible;
        this.changeDetectorRef.markForCheck();
      });
  }
}
