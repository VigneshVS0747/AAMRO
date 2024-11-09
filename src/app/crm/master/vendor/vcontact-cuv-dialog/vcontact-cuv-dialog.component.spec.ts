import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VcontactCuvDialogComponent } from './vcontact-cuv-dialog.component';

describe('VcontactCuvDialogComponent', () => {
  let component: VcontactCuvDialogComponent;
  let fixture: ComponentFixture<VcontactCuvDialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [VcontactCuvDialogComponent]
    });
    fixture = TestBed.createComponent(VcontactCuvDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
