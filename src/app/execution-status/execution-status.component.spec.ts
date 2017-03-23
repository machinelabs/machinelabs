import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { ExecutionStatusComponent } from './execution-status.component';
import { LabExecutionContext, ExecutionStatus } from '../models/lab';

describe('ExecutionStatusComponent', () => {
  let component: ExecutionStatusComponent;
  let fixture: ComponentFixture<ExecutionStatusComponent>;
  let context: LabExecutionContext;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ExecutionStatusComponent],
      schemas: [NO_ERRORS_SCHEMA]
    });

    fixture = TestBed.createComponent(ExecutionStatusComponent);
    component = fixture.componentInstance;
    context = new LabExecutionContext();

    component.executionContext = context;
    fixture.detectChanges();
  });

  it('shouldn\'t show any status if status is pristine ', () => {
    let statusMessage = fixture.debugElement.query(By.css('.ml-status-message'));
    expect(statusMessage).toBe(null);
  });

  it('should show status message based on status type', () => {
    let statusMessage;

    context.status = ExecutionStatus.Running;
    fixture.detectChanges();
    statusMessage = fixture.debugElement.query(By.css('.ml-status-message'));
    expect(statusMessage.nativeElement.textContent).toContain('Running...');

    context.status = ExecutionStatus.Done;
    fixture.detectChanges();
    statusMessage = fixture.debugElement.query(By.css('.ml-status-message'));
    expect(statusMessage.nativeElement.textContent).toContain('Done');

    context.status = ExecutionStatus.Stopped;
    fixture.detectChanges();
    statusMessage = fixture.debugElement.query(By.css('.ml-status-message'));
    expect(statusMessage.nativeElement.textContent).toContain('Stopped');

    context.status = ExecutionStatus.Error;
    fixture.detectChanges();
    statusMessage = fixture.debugElement.query(By.css('.ml-status-message'));
    expect(statusMessage.nativeElement.textContent).toContain('Errored');
  });

  it('should render progress bar when lab is running', () => {
    context.status = ExecutionStatus.Running;
    fixture.detectChanges();

    let progressBar = fixture.debugElement.query(By.css('md-progress-bar'));
    expect(progressBar).toBeDefined();
  });
});
