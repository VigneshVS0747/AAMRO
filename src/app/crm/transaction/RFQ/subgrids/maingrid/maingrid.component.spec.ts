import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MaingridComponent } from './maingrid.component';

describe('MaingridComponent', () => {
  let component: MaingridComponent;
  let fixture: ComponentFixture<MaingridComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MaingridComponent]
    });
    fixture = TestBed.createComponent(MaingridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
