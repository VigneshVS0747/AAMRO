import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NotificationbellComponent } from './notificationbell.component';

describe('NotificationbellComponent', () => {
  let component: NotificationbellComponent;
  let fixture: ComponentFixture<NotificationbellComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [NotificationbellComponent]
    });
    fixture = TestBed.createComponent(NotificationbellComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
