import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VaddressCuvDialogComponent } from './vaddress-cuv-dialog.component';

describe('VaddressCuvDialogComponent', () => {
  let component: VaddressCuvDialogComponent;
  let fixture: ComponentFixture<VaddressCuvDialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [VaddressCuvDialogComponent]
    });
    fixture = TestBed.createComponent(VaddressCuvDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
