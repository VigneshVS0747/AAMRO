import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HscodeListComponent } from './hscode-list.component';

describe('HscodeListComponent', () => {
  let component: HscodeListComponent;
  let fixture: ComponentFixture<HscodeListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [HscodeListComponent]
    });
    fixture = TestBed.createComponent(HscodeListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
