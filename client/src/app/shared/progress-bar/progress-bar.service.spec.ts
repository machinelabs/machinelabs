import { ProgressBarService, ProgressBarEventType } from './progress-bar.service';
import { filter, map } from 'rxjs/operators';

describe('ProgressBarService', () => {
  it('should set the Visible eventtype to true', done => {
    const svc = new ProgressBarService();
    svc.progressbarEvents
      .pipe(filter(event => event.eventType === ProgressBarEventType.Visible), map(event => event.value))
      .subscribe(visible => {
        expect(visible).toBe(true);
        done();
      });
    svc.start();
  });

  it('should emit a visible eventtype with a value of false', done => {
    const svc = new ProgressBarService();

    svc.progressbarEvents
      .pipe(filter(event => event.eventType === ProgressBarEventType.Visible), map(event => event.value))
      .subscribe(visible => {
        expect(visible).toBe(false);
        done();
      });
    svc.stop();
  });
});
