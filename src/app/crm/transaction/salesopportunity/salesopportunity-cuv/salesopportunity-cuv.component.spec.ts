import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SalesopportunityCuvComponent } from './salesopportunity-cuv.component';

describe('SalesopportunityCuvComponent', () => {
  let component: SalesopportunityCuvComponent;
  let fixture: ComponentFixture<SalesopportunityCuvComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SalesopportunityCuvComponent]
    });
    fixture = TestBed.createComponent(SalesopportunityCuvComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
