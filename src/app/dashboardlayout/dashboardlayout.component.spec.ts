import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardlayoutComponent } from './dashboardlayout.component';

describe('DashboardlayoutComponent', () => {
  let component: DashboardlayoutComponent;
  let fixture: ComponentFixture<DashboardlayoutComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DashboardlayoutComponent]
    });
    fixture = TestBed.createComponent(DashboardlayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
