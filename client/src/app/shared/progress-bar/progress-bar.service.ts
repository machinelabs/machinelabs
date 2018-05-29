import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';

export enum ProgressBarEventType {
  Progress,
  Visible
}

export interface ProgressBarEvent {
  eventType: ProgressBarEventType;
  value: any;
}

@Injectable()
export class ProgressBarService {
  private events: Subject<ProgressBarEvent> = new Subject<ProgressBarEvent>();
  public progressbarEvents: Observable<ProgressBarEvent> = this.events.asObservable();

  public start(): void {
    this.emitEvent({
      eventType: ProgressBarEventType.Visible,
      value: true
    });
  }
  public stop(): void {
    this.emitEvent({
      eventType: ProgressBarEventType.Visible,
      value: false
    });
  }

  private emitEvent(event: ProgressBarEvent) {
    this.events.next(event);
  }
}
