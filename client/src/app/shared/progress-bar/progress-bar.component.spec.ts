import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatProgressBarModule } from '@angular/material';
import { ProgressBarComponent } from './progress-bar.component';
import { ProgressBarService } from './progress-bar.service';

describe('ProgressBarComponent', () => {
  let component: ProgressBarComponent;
  let fixture: ComponentFixture<ProgressBarComponent>;
  let svc: ProgressBarService;
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [MatProgressBarModule],
      declarations: [ProgressBarComponent],
      providers: [ProgressBarService]
    });
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProgressBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    svc = TestBed.get(ProgressBarService);
  });

  it('should be defined', () => {
    expect(component).toBeDefined();
  });

  it('should show the progress-bar', () => {
    expect(component.isVisible).toBe(false);
    svc.start();
    expect(component.isVisible).toBe(true);
  });

  it('should hide the progress-bar', () => {
    svc.start();
    expect(component.isVisible).toBe(true);
    svc.stop();
    expect(component.isVisible).toBe(false);
  });
});
