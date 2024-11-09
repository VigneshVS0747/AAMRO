import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StandaloneDialogComponent } from './standalone-dialog.component';

describe('StandaloneDialogComponent', () => {
  let component: StandaloneDialogComponent;
  let fixture: ComponentFixture<StandaloneDialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [StandaloneDialogComponent]
    });
    fixture = TestBed.createComponent(StandaloneDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
