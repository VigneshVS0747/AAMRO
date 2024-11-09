import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JorbDetailDialogComponent } from './jorb-detail-dialog.component';

describe('JorbDetailDialogComponent', () => {
  let component: JorbDetailDialogComponent;
  let fixture: ComponentFixture<JorbDetailDialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [JorbDetailDialogComponent]
    });
    fixture = TestBed.createComponent(JorbDetailDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
