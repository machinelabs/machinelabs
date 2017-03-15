import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { PanelComponent } from './panel.component';

describe('PanelComponent', () => {
  let component: PanelComponent;
  let fixture: ComponentFixture<PanelComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PanelComponent]
    });

    fixture = TestBed.createComponent(PanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should render panel title', () => {
    component.panelTitle = 'Panel title';

    let titleElement = fixture.debugElement.query(By.css('h2')).nativeElement;

    fixture.detectChanges();
    expect(titleElement.textContent).toContain('Panel title');
  });
});
