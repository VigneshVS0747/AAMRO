import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QLIVendorValueDetailComponent } from './qlivendor-value-detail.component';

describe('QLIVendorValueDetailComponent', () => {
  let component: QLIVendorValueDetailComponent;
  let fixture: ComponentFixture<QLIVendorValueDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [QLIVendorValueDetailComponent]
    });
    fixture = TestBed.createComponent(QLIVendorValueDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
