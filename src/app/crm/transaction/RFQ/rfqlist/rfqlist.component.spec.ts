import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RfqlistComponent } from './rfqlist.component';

describe('RfqlistComponent', () => {
  let component: RfqlistComponent;
  let fixture: ComponentFixture<RfqlistComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RfqlistComponent]
    });
    fixture = TestBed.createComponent(RfqlistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
