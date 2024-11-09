import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PqcompareComponent } from './pqcompare.component';

describe('PqcompareComponent', () => {
  let component: PqcompareComponent;
  let fixture: ComponentFixture<PqcompareComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PqcompareComponent]
    });
    fixture = TestBed.createComponent(PqcompareComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
