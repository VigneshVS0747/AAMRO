import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TaxcodeCuvComponent } from './taxcode-cuv.component';

describe('TaxcodeCuvComponent', () => {
  let component: TaxcodeCuvComponent;
  let fixture: ComponentFixture<TaxcodeCuvComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TaxcodeCuvComponent]
    });
    fixture = TestBed.createComponent(TaxcodeCuvComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
