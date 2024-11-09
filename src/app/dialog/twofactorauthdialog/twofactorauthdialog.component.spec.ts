import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TwofactorauthdialogComponent } from './twofactorauthdialog.component';

describe('TwofactorauthdialogComponent', () => {
  let component: TwofactorauthdialogComponent;
  let fixture: ComponentFixture<TwofactorauthdialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TwofactorauthdialogComponent]
    });
    fixture = TestBed.createComponent(TwofactorauthdialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
