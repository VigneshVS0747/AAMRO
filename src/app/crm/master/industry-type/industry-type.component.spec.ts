import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IndustryTypeComponent } from './industry-type.component';

describe('IndustryTypeComponent', () => {
  let component: IndustryTypeComponent;
  let fixture: ComponentFixture<IndustryTypeComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [IndustryTypeComponent]
    });
    fixture = TestBed.createComponent(IndustryTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
