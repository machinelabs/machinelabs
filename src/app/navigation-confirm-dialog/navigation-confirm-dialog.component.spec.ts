import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NavigationConfirmDialogComponent } from './navigation-confirm-dialog.component';

describe('NavigationConfirmDialogComponent', () => {
  let component: NavigationConfirmDialogComponent;
  let fixture: ComponentFixture<NavigationConfirmDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NavigationConfirmDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NavigationConfirmDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
});
