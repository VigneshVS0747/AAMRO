import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LineItemMasterComponent } from './line-item-master.component';

describe('LineItemMasterComponent', () => {
  let component: LineItemMasterComponent;
  let fixture: ComponentFixture<LineItemMasterComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [LineItemMasterComponent]
    });
    fixture = TestBed.createComponent(LineItemMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
