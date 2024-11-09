import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VendorfilterdialogComponent } from './vendorfilterdialog.component';

describe('VendorfilterdialogComponent', () => {
  let component: VendorfilterdialogComponent;
  let fixture: ComponentFixture<VendorfilterdialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [VendorfilterdialogComponent]
    });
    fixture = TestBed.createComponent(VendorfilterdialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
