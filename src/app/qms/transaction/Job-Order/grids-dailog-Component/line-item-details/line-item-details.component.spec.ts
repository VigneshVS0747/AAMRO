import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LineItemDetailsComponent } from './line-item-details.component';

describe('LineItemDetailsComponent', () => {
  let component: LineItemDetailsComponent;
  let fixture: ComponentFixture<LineItemDetailsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [LineItemDetailsComponent]
    });
    fixture = TestBed.createComponent(LineItemDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
