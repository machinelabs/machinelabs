import { Component, OnInit, Input, OnChanges, SimpleChanges, OnDestroy } from '@angular/core';
import { Observable, interval, NEVER, BehaviorSubject } from 'rxjs';
import { map, switchMap, startWith, tap } from 'rxjs/operators';

import * as distanceInWordsToNow from 'date-fns/distance_in_words_to_now';

@Component({
  selector: 'ml-duration-tracker',
  template: `
    <time [attr.datetime]="startDate">
      {{ duration$ | async }}
    </time>
  `
})
export class DurationTrackerComponent implements OnInit, OnChanges, OnDestroy {
  @Input() startDate;
  @Input() delay = 1000;
  @Input() pause = false;

  duration$: Observable<string>;

  private pause$ = new BehaviorSubject<boolean>(false);

  ngOnInit() {
    this.pause$.next(this.pause);

    if (!this.startDate) {
      console.warn('[ml-duration-tracker] Please provide a startDate');
    }

    this.duration$ = this.pause$.pipe(switchMap(paused => (paused ? NEVER : this.trackDuration())));
  }

  ngOnChanges(changes: SimpleChanges) {
    if (!changes.pause.previousValue || changes.pause.currentValue !== changes.pause.previousValue) {
      this.pause$.next(changes.pause.currentValue);
    }
  }

  ngOnDestroy() {
    this.pause$.complete();
  }

  trackDuration() {
    return interval(this.delay).pipe(
      startWith(0),
      map(_ =>
        distanceInWordsToNow(new Date(this.startDate), {
          includeSeconds: true
        })
      )
    );
  }
}
