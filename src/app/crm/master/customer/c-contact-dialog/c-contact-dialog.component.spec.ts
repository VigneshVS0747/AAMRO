import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CContactDialogComponent } from './c-contact-dialog.component';

describe('CContactDialogComponent', () => {
  let component: CContactDialogComponent;
  let fixture: ComponentFixture<CContactDialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CContactDialogComponent]
    });
    fixture = TestBed.createComponent(CContactDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
