import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EnqpackageDialogComponent } from './enqpackage-dialog.component';

describe('EnqpackageDialogComponent', () => {
  let component: EnqpackageDialogComponent;
  let fixture: ComponentFixture<EnqpackageDialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EnqpackageDialogComponent]
    });
    fixture = TestBed.createComponent(EnqpackageDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
