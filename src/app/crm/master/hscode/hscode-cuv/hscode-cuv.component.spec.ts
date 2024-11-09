import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HscodeCuvComponent } from './hscode-cuv.component';

describe('HscodeCuvComponent', () => {
  let component: HscodeCuvComponent;
  let fixture: ComponentFixture<HscodeCuvComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [HscodeCuvComponent]
    });
    fixture = TestBed.createComponent(HscodeCuvComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
