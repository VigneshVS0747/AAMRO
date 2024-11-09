import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JoebLineitemDialogComponent } from './joeb-lineitem-dialog.component';

describe('JoebLineitemDialogComponent', () => {
  let component: JoebLineitemDialogComponent;
  let fixture: ComponentFixture<JoebLineitemDialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [JoebLineitemDialogComponent]
    });
    fixture = TestBed.createComponent(JoebLineitemDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
