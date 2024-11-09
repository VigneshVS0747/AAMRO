import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AirStatusComponent } from './air-status.component';

describe('AirStatusComponent', () => {
  let component: AirStatusComponent;
  let fixture: ComponentFixture<AirStatusComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AirStatusComponent]
    });
    fixture = TestBed.createComponent(AirStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
