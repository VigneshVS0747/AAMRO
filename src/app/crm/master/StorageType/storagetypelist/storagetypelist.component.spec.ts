import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StoragetypelistComponent } from './storagetypelist.component';

describe('StoragetypelistComponent', () => {
  let component: StoragetypelistComponent;
  let fixture: ComponentFixture<StoragetypelistComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [StoragetypelistComponent]
    });
    fixture = TestBed.createComponent(StoragetypelistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
