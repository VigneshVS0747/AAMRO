import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Subgrid01Component } from './subgrid01.component';

describe('Subgrid01Component', () => {
  let component: Subgrid01Component;
  let fixture: ComponentFixture<Subgrid01Component>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [Subgrid01Component]
    });
    fixture = TestBed.createComponent(Subgrid01Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
