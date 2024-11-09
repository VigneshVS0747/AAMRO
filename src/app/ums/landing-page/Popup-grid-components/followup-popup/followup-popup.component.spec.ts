import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FollowupPopupComponent } from './followup-popup.component';

describe('FollowupPopupComponent', () => {
  let component: FollowupPopupComponent;
  let fixture: ComponentFixture<FollowupPopupComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FollowupPopupComponent]
    });
    fixture = TestBed.createComponent(FollowupPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
