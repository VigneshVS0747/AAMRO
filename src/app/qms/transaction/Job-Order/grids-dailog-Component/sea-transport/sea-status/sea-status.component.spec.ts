import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SeaStatusComponent } from './sea-status.component';

describe('SeaStatusComponent', () => {
  let component: SeaStatusComponent;
  let fixture: ComponentFixture<SeaStatusComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SeaStatusComponent]
    });
    fixture = TestBed.createComponent(SeaStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
