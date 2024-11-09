import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SeaportCuvComponent } from './seaport-cuv.component';

describe('SeaportCuvComponent', () => {
  let component: SeaportCuvComponent;
  let fixture: ComponentFixture<SeaportCuvComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SeaportCuvComponent]
    });
    fixture = TestBed.createComponent(SeaportCuvComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
