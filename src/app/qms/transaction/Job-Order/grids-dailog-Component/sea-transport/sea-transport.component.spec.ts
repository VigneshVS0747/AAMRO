import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SeaTransportComponent } from './sea-transport.component';

describe('SeaTransportComponent', () => {
  let component: SeaTransportComponent;
  let fixture: ComponentFixture<SeaTransportComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SeaTransportComponent]
    });
    fixture = TestBed.createComponent(SeaTransportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
