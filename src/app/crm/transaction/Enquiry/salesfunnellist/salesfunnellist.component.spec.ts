import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SalesfunnellistComponent } from './salesfunnellist.component';

describe('SalesfunnellistComponent', () => {
  let component: SalesfunnellistComponent;
  let fixture: ComponentFixture<SalesfunnellistComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SalesfunnellistComponent]
    });
    fixture = TestBed.createComponent(SalesfunnellistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
