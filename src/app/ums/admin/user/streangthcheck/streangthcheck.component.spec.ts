import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StreangthcheckComponent } from './streangthcheck.component';

describe('StreangthcheckComponent', () => {
  let component: StreangthcheckComponent;
  let fixture: ComponentFixture<StreangthcheckComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [StreangthcheckComponent]
    });
    fixture = TestBed.createComponent(StreangthcheckComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
