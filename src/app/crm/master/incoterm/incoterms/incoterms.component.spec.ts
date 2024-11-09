import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IncotermsComponent } from './incoterms.component';

describe('IncotermsComponent', () => {
  let component: IncotermsComponent;
  let fixture: ComponentFixture<IncotermsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [IncotermsComponent]
    });
    fixture = TestBed.createComponent(IncotermsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
