import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PermitListComponent } from './permit-list.component';

describe('PermitListComponent', () => {
  let component: PermitListComponent;
  let fixture: ComponentFixture<PermitListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PermitListComponent]
    });
    fixture = TestBed.createComponent(PermitListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
