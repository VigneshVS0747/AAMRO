import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InfosourceComponent } from './infosource.component';

describe('InfosourceComponent', () => {
  let component: InfosourceComponent;
  let fixture: ComponentFixture<InfosourceComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [InfosourceComponent]
    });
    fixture = TestBed.createComponent(InfosourceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
