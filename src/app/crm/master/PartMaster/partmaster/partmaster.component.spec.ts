import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PartmasterComponent } from './partmaster.component';

describe('PartmasterComponent', () => {
  let component: PartmasterComponent;
  let fixture: ComponentFixture<PartmasterComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PartmasterComponent]
    });
    fixture = TestBed.createComponent(PartmasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
