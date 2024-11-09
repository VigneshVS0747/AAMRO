import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JorbLineitemDialogComponent } from './jorb-lineitem-dialog.component';

describe('JorbLineitemDialogComponent', () => {
  let component: JorbLineitemDialogComponent;
  let fixture: ComponentFixture<JorbLineitemDialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [JorbLineitemDialogComponent]
    });
    fixture = TestBed.createComponent(JorbLineitemDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
