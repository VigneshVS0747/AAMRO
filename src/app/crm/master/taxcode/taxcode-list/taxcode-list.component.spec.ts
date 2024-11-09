import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TaxcodeListComponent } from './taxcode-list.component';

describe('TaxcodeListComponent', () => {
  let component: TaxcodeListComponent;
  let fixture: ComponentFixture<TaxcodeListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TaxcodeListComponent]
    });
    fixture = TestBed.createComponent(TaxcodeListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
