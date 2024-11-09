import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RfqaddressdialogComponent } from './rfqaddressdialog.component';

describe('RfqaddressdialogComponent', () => {
  let component: RfqaddressdialogComponent;
  let fixture: ComponentFixture<RfqaddressdialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RfqaddressdialogComponent]
    });
    fixture = TestBed.createComponent(RfqaddressdialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
