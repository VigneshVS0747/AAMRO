import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModeOfTransportComponent } from './mode-of-transport.component';

describe('ModeOfTransportComponent', () => {
  let component: ModeOfTransportComponent;
  let fixture: ComponentFixture<ModeOfTransportComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ModeOfTransportComponent]
    });
    fixture = TestBed.createComponent(ModeOfTransportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
