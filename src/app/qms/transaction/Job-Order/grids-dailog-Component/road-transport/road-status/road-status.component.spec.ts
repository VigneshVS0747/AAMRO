import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RoadStatusComponent } from './road-status.component';

describe('RoadStatusComponent', () => {
  let component: RoadStatusComponent;
  let fixture: ComponentFixture<RoadStatusComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RoadStatusComponent]
    });
    fixture = TestBed.createComponent(RoadStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
