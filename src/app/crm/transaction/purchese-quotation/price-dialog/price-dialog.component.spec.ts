import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PriceDialogComponent } from './price-dialog.component';

describe('PriceDialogComponent', () => {
  let component: PriceDialogComponent;
  let fixture: ComponentFixture<PriceDialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PriceDialogComponent]
    });
    fixture = TestBed.createComponent(PriceDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
