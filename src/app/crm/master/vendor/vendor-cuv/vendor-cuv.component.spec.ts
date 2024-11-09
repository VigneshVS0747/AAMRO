import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VendorCuvComponent } from './vendor-cuv.component';

describe('VendorCuvComponent', () => {
  let component: VendorCuvComponent;
  let fixture: ComponentFixture<VendorCuvComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [VendorCuvComponent]
    });
    fixture = TestBed.createComponent(VendorCuvComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
