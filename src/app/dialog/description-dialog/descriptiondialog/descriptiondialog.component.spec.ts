import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DescriptiondialogComponent } from './descriptiondialog.component';

describe('DescriptiondialogComponent', () => {
  let component: DescriptiondialogComponent;
  let fixture: ComponentFixture<DescriptiondialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DescriptiondialogComponent]
    });
    fixture = TestBed.createComponent(DescriptiondialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
