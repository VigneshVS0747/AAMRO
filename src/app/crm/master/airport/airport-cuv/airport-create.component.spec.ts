import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AirportCreateComponent } from './airport-create.component';

describe('AirportCreateComponent', () => {
  let component: AirportCreateComponent;
  let fixture: ComponentFixture<AirportCreateComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AirportCreateComponent]
    });
    fixture = TestBed.createComponent(AirportCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
