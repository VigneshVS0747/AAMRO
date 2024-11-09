import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrailerTypeComponent } from './trailer-type.component';

describe('TrailerTypeComponent', () => {
  let component: TrailerTypeComponent;
  let fixture: ComponentFixture<TrailerTypeComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TrailerTypeComponent]
    });
    fixture = TestBed.createComponent(TrailerTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
