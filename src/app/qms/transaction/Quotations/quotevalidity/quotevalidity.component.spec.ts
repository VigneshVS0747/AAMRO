import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuotevalidityComponent } from './quotevalidity.component';

describe('QuotevalidityComponent', () => {
  let component: QuotevalidityComponent;
  let fixture: ComponentFixture<QuotevalidityComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [QuotevalidityComponent]
    });
    fixture = TestBed.createComponent(QuotevalidityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
