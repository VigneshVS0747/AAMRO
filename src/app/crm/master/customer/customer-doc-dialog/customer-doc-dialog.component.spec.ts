import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerDocDialogComponent } from './customer-doc-dialog.component';

describe('CustomerDocDialogComponent', () => {
  let component: CustomerDocDialogComponent;
  let fixture: ComponentFixture<CustomerDocDialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CustomerDocDialogComponent]
    });
    fixture = TestBed.createComponent(CustomerDocDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
