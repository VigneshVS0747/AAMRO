import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Subgrid02Component } from './subgrid02.component';

describe('Subgrid02Component', () => {
  let component: Subgrid02Component;
  let fixture: ComponentFixture<Subgrid02Component>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [Subgrid02Component]
    });
    fixture = TestBed.createComponent(Subgrid02Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
