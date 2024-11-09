import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PIdetailsComponent } from './pidetails.component';

describe('PIdetailsComponent', () => {
  let component: PIdetailsComponent;
  let fixture: ComponentFixture<PIdetailsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PIdetailsComponent]
    });
    fixture = TestBed.createComponent(PIdetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
