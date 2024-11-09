import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PIlineItemComponent } from './piline-item.component';

describe('PIlineItemComponent', () => {
  let component: PIlineItemComponent;
  let fixture: ComponentFixture<PIlineItemComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PIlineItemComponent]
    });
    fixture = TestBed.createComponent(PIlineItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
