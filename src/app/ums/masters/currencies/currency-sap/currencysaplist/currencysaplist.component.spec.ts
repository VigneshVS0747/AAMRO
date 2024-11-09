import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CurrencysaplistComponent } from './currencysaplist.component';

describe('CurrencysaplistComponent', () => {
  let component: CurrencysaplistComponent;
  let fixture: ComponentFixture<CurrencysaplistComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CurrencysaplistComponent]
    });
    fixture = TestBed.createComponent(CurrencysaplistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
