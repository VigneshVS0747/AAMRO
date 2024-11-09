import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NotificationconfigurationlistComponent } from './notificationconfigurationlist.component';

describe('NotificationconfigurationlistComponent', () => {
  let component: NotificationconfigurationlistComponent;
  let fixture: ComponentFixture<NotificationconfigurationlistComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [NotificationconfigurationlistComponent]
    });
    fixture = TestBed.createComponent(NotificationconfigurationlistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
