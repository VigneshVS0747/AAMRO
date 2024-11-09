import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PIvendorvalueComponent } from './pivendorvalue.component';

describe('PIvendorvalueComponent', () => {
  let component: PIvendorvalueComponent;
  let fixture: ComponentFixture<PIvendorvalueComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PIvendorvalueComponent]
    });
    fixture = TestBed.createComponent(PIvendorvalueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
