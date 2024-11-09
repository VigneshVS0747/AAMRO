import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PotentialVendorCuvComponent } from './potential-vendor-cuv.component';

describe('PotentialVendorCuvComponent', () => {
  let component: PotentialVendorCuvComponent;
  let fixture: ComponentFixture<PotentialVendorCuvComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PotentialVendorCuvComponent]
    });
    fixture = TestBed.createComponent(PotentialVendorCuvComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
