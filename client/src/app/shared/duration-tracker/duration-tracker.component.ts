import { Component, OnInit, Input, OnChanges, SimpleChanges, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { interval } from 'rxjs/observable/interval';
import { never } from 'rxjs/observable/never';
import { map, switchMap, startWith, tap } from 'rxjs/operators';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

import * as distanceInWordsToNow from 'date-fns/distance_in_words_to_now';
import { Subscription } from 'rxjs/Subscription';

@Component({
  selector: 'ml-duration-tracker',
  template: `
    <time [attr.datetime]="startDate">
      {{ duration }}
    </time>
  `
})
export class DurationTrackerComponent implements OnInit, OnChanges, OnDestroy {

  @Input() startDate;
  @Input() delay = 1000;
  @Input() pause = false;

  duration: string;
  durationSubscription: Subscription;

  private pause$ = new BehaviorSubject<boolean>(false);

  constructor(private cdr: ChangeDetectorRef) {}

  ngOnInit() {
    this.cdr.detach();

    this.pause$.next(this.pause);

    if (!this.startDate) {
      console.warn('[ml-duration-tracker] Please provide a startDate');
    }

    this.durationSubscription = this.pause$.pipe(
      switchMap(paused => paused ? never<string>() : this.trackDuration())
    ).subscribe(duration => this.duration = duration);
  }

  ngOnChanges(changes: SimpleChanges) {
    if (!changes.pause.previousValue || changes.pause.currentValue !== changes.pause.previousValue) {
      this.pause$.next(changes.pause.currentValue);
    }
  }

  ngOnDestroy() {
    this.pause$.complete();
    this.durationSubscription.unsubscribe();
  }

  trackDuration() {
    return interval(this.delay).pipe(
      startWith(0),
      map(_ => distanceInWordsToNow(new Date(this.startDate), {
        includeSeconds: true
      })),
      tap(_ => this.cdr.detectChanges())
    );
  }
}
