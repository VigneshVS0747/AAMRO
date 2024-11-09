import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LineitemmasterlistComponent } from './lineitemmasterlist.component';

describe('LineitemmasterlistComponent', () => {
  let component: LineitemmasterlistComponent;
  let fixture: ComponentFixture<LineitemmasterlistComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [LineitemmasterlistComponent]
    });
    fixture = TestBed.createComponent(LineitemmasterlistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
