import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LineitemcategoryComponent } from './lineitemcategory.component';

describe('LineitemcategoryComponent', () => {
  let component: LineitemcategoryComponent;
  let fixture: ComponentFixture<LineitemcategoryComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [LineitemcategoryComponent]
    });
    fixture = TestBed.createComponent(LineitemcategoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
