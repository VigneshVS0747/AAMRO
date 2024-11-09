import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PotentialVendorListComponent } from './potential-vendor-list.component';

describe('PotentialVendorListComponent', () => {
  let component: PotentialVendorListComponent;
  let fixture: ComponentFixture<PotentialVendorListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PotentialVendorListComponent]
    });
    fixture = TestBed.createComponent(PotentialVendorListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
