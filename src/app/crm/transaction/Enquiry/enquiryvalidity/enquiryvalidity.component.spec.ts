import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EnquiryvalidityComponent } from './enquiryvalidity.component';

describe('EnquiryvalidityComponent', () => {
  let component: EnquiryvalidityComponent;
  let fixture: ComponentFixture<EnquiryvalidityComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EnquiryvalidityComponent]
    });
    fixture = TestBed.createComponent(EnquiryvalidityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
