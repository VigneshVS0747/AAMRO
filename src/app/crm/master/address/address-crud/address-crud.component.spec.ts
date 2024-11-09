import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddressCrudComponent } from './address-crud.component';

describe('AddressCrudComponent', () => {
  let component: AddressCrudComponent;
  let fixture: ComponentFixture<AddressCrudComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AddressCrudComponent]
    });
    fixture = TestBed.createComponent(AddressCrudComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
