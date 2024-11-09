import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PackagetypeListComponent } from './packagetype-list.component';

describe('PackagetypeListComponent', () => {
  let component: PackagetypeListComponent;
  let fixture: ComponentFixture<PackagetypeListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PackagetypeListComponent]
    });
    fixture = TestBed.createComponent(PackagetypeListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
