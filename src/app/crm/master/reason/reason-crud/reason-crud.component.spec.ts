import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReasonCrudComponent } from './reason-crud.component';

describe('ReasonCrudComponent', () => {
  let component: ReasonCrudComponent;
  let fixture: ComponentFixture<ReasonCrudComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ReasonCrudComponent]
    });
    fixture = TestBed.createComponent(ReasonCrudComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
