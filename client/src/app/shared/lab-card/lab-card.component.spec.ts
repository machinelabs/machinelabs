import { NO_ERRORS_SCHEMA, DebugElement, Component } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { RouterTestingModule } from '@angular/router/testing';

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { of } from 'rxjs/observable/of';

import { LabCardComponent } from './lab-card.component';
import { Lab } from '../../models/lab';
import { TruncateWordsPipe } from '../truncate-words.pipe';
import { ExecutionCardComponent } from '../execution-card/execution-card.component';
import { ExecutionStatus } from '@machinelabs/models';
import { DistanceInWordsToNowPipe } from '../distance-in-words-to-now.pipe';

const dummyLab: Lab = {
  id: '1',
  name: 'Lab',
  is_private: false,
  tags: [],
  description: 'Description',
  directory: null,
  user_id: '2',
  created_at: 1,
  modified_at: 2,
  hidden: false
};

const dummyUser = {
  id: '2',
  displayName: 'AA',
  photoUrl: '/photo/url.png',
  email: 'a@a.com',
  isAnonymous: false
};

const dummyExecution = {
  id: '1',
  status: ExecutionStatus.Finished,
  lab: { id: '1', directory: [] },
  started_at: 123
};

const dummyExecutionsArray = [
  {
    id: '1',
    execution: of(dummyExecution)
  }
];

@Component({
  template: ''
})
class DummyRoutingComponent {}

describe('LabCardComponent', () => {
  let component: LabCardComponent;
  let fixture: ComponentFixture<LabCardComponent>;
  let element: DebugElement;
  let location: Location;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        LabCardComponent,
        ExecutionCardComponent,
        DummyRoutingComponent,
        TruncateWordsPipe,
        DistanceInWordsToNowPipe
      ],
      schemas: [NO_ERRORS_SCHEMA],
      imports: [
        CommonModule,
        RouterTestingModule.withRoutes([
          { path: 'editor/:labId', component: DummyRoutingComponent },
          { path: 'editor/:labId/:execId', component: DummyRoutingComponent },
          { path: 'user/:userId', component: DummyRoutingComponent }
        ])
      ]
    });
    location = TestBed.get(Location);

    fixture = TestBed.createComponent(LabCardComponent);
    component = fixture.componentInstance;

    component.lab = dummyLab;
    component.user = dummyUser;
    component.executions = dummyExecutionsArray;

    fixture.detectChanges();
    element = fixture.debugElement;
  });

  it('should display lab title', () => {
    const labTitleElement = element.query(By.css('.ml-lab-card-link')).nativeElement;
    expect(labTitleElement.textContent).toContain(dummyLab.name);
  });

  it('should display lab author', () => {
    const labUserElement = element.query(By.css('.ml-lab-card-user')).nativeElement;
    expect(labUserElement.textContent).toContain(dummyUser.displayName);
  });

  it('should display author avatar next to name', () => {
    const userAvatarElement = element.query(By.css('.ml-lab-card-user > img')).nativeElement;
    expect(userAvatarElement.src).toContain(dummyUser.photoUrl);
  });

  it('should navigate to lab when card is clicked', async () => {
    const labCardElement = element.query(By.css('.ml-lab-card-link-area')).nativeElement;
    labCardElement.click();
    fixture.detectChanges();
    await fixture.whenStable();
    expect(location.path()).toBe(`/editor/${dummyLab.id}`);
  });

  it('should navigate to lab when lab name is clicked', async () => {
    const labTitleElement = element.query(By.css('.ml-lab-card-link')).nativeElement;
    labTitleElement.click();
    fixture.detectChanges();
    await fixture.whenStable();
    expect(location.path()).toBe(`/editor/${dummyLab.id}`);
  });

  it('should navigate to user profile when user name is clicked', async () => {
    const labUserElement = element.query(By.css('.ml-lab-card-username')).nativeElement;
    labUserElement.click();
    fixture.detectChanges();
    await fixture.whenStable();
    expect(location.path()).toBe(`/user/${dummyUser.id}`);
  });

  it('should navigate to lab execution when execution is clicked', async () => {
    const labExecutionElement = element.query(By.css('.ml-execution-card-panel')).nativeElement;
    labExecutionElement.click();
    fixture.detectChanges();
    await fixture.whenStable();
    expect(location.path()).toBe(`/editor/${dummyExecution.lab.id}/${dummyExecution.id}`);
  });
});
