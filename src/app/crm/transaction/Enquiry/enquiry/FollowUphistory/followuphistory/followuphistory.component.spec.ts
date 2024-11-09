import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FollowuphistoryComponent } from './followuphistory.component';

describe('FollowuphistoryComponent', () => {
  let component: FollowuphistoryComponent;
  let fixture: ComponentFixture<FollowuphistoryComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FollowuphistoryComponent]
    });
    fixture = TestBed.createComponent(FollowuphistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
