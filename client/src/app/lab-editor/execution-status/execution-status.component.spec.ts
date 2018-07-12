import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { ExecutionStatusComponent } from './execution-status.component';
import { Execution } from '../../models/execution';
import { Subject } from 'rxjs';
import { ExecutionStatus } from '@machinelabs/models';

describe('ExecutionStatusComponent', () => {
  let component: ExecutionStatusComponent;
  let fixture: ComponentFixture<ExecutionStatusComponent>;
  const execution = new Subject<Execution>();

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ExecutionStatusComponent],
      schemas: [NO_ERRORS_SCHEMA]
    });

    fixture = TestBed.createComponent(ExecutionStatusComponent);
    component = fixture.componentInstance;

    component.execution = execution;
    fixture.detectChanges();
  });

  it("shouldn't show any status if status is pristine ", () => {
    const statusMessage = fixture.debugElement.query(By.css('.ml-status-message'));
    expect(statusMessage).toBe(null);
  });

  it('should show status message based on status type', () => {
    let statusMessage;

    execution.next({ status: ExecutionStatus.Executing });
    fixture.detectChanges();
    statusMessage = fixture.debugElement.query(By.css('.ml-status-message'));
    expect(statusMessage.nativeElement.textContent).toContain('Running...');

    execution.next({ status: ExecutionStatus.Finished });
    fixture.detectChanges();
    statusMessage = fixture.debugElement.query(By.css('.ml-status-message'));
    expect(statusMessage.nativeElement.textContent).toContain('Done');

    execution.next({ status: ExecutionStatus.Stopped });
    fixture.detectChanges();
    statusMessage = fixture.debugElement.query(By.css('.ml-status-message'));
    expect(statusMessage.nativeElement.textContent).toContain('Stopped');

    execution.next({ status: ExecutionStatus.Failed });
    fixture.detectChanges();
    statusMessage = fixture.debugElement.query(By.css('.ml-status-message'));
    expect(statusMessage.nativeElement.textContent).toContain('Errored');
  });

  it('should render progress bar when lab is running', () => {
    execution.next({ status: ExecutionStatus.Executing });
    fixture.detectChanges();

    const progressBar = fixture.debugElement.query(By.css('mat-progress-bar'));
    expect(progressBar).toBeDefined();
  });
});
