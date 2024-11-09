import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ServicetypeComponent } from './servicetype.component';

describe('ServicetypeComponent', () => {
  let component: ServicetypeComponent;
  let fixture: ComponentFixture<ServicetypeComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ServicetypeComponent]
    });
    fixture = TestBed.createComponent(ServicetypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
