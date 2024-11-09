import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContainertypeListComponent } from './containertype-list.component';

describe('ContainertypeListComponent', () => {
  let component: ContainertypeListComponent;
  let fixture: ComponentFixture<ContainertypeListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ContainertypeListComponent]
    });
    fixture = TestBed.createComponent(ContainertypeListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
