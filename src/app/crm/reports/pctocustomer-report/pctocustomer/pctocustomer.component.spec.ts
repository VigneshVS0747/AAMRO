import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PctocustomerComponent } from './pctocustomer.component';

describe('PctocustomerComponent', () => {
  let component: PctocustomerComponent;
  let fixture: ComponentFixture<PctocustomerComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PctocustomerComponent]
    });
    fixture = TestBed.createComponent(PctocustomerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
