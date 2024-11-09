import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActCreateComponent } from './act-create.component';

describe('ActCreateComponent', () => {
  let component: ActCreateComponent;
  let fixture: ComponentFixture<ActCreateComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ActCreateComponent]
    });
    fixture = TestBed.createComponent(ActCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
