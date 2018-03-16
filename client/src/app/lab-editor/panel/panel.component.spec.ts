import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { PanelComponent } from './panel.component';
import { PanelTitleComponent } from './panel-title.component';

describe('PanelComponent', () => {
  let component: PanelComponent;
  let fixture: ComponentFixture<PanelComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PanelComponent, PanelTitleComponent]
    });

    fixture = TestBed.createComponent(PanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should render panel title', () => {
    component.panelTitle = 'Panel title';

    fixture.detectChanges();
    const titleElement = fixture.debugElement.query(By.css('ml-panel-title')).nativeElement;
    expect(titleElement.textContent).toContain('Panel title');
  });
});
