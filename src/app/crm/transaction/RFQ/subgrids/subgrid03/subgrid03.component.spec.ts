import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Subgrid03Component } from './subgrid03.component';

describe('Subgrid03Component', () => {
  let component: Subgrid03Component;
  let fixture: ComponentFixture<Subgrid03Component>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [Subgrid03Component]
    });
    fixture = TestBed.createComponent(Subgrid03Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
