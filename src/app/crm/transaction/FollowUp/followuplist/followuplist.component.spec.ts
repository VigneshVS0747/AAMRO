import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FollowuplistComponent } from './followuplist.component';

describe('FollowuplistComponent', () => {
  let component: FollowuplistComponent;
  let fixture: ComponentFixture<FollowuplistComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FollowuplistComponent]
    });
    fixture = TestBed.createComponent(FollowuplistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
