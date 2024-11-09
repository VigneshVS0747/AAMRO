import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RfqpackageComponent } from './rfqpackage.component';

describe('RfqpackageComponent', () => {
  let component: RfqpackageComponent;
  let fixture: ComponentFixture<RfqpackageComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RfqpackageComponent]
    });
    fixture = TestBed.createComponent(RfqpackageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
