import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RoadTransportComponent } from './road-transport.component';

describe('RoadTransportComponent', () => {
  let component: RoadTransportComponent;
  let fixture: ComponentFixture<RoadTransportComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RoadTransportComponent]
    });
    fixture = TestBed.createComponent(RoadTransportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
