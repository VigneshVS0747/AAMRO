import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContactTypeComponent } from './contact-type.component';

describe('ContactTypeComponent', () => {
  let component: ContactTypeComponent;
  let fixture: ComponentFixture<ContactTypeComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ContactTypeComponent]
    });
    fixture = TestBed.createComponent(ContactTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
