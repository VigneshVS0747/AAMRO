import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PartMasterListComponent } from './part-master-list.component';

describe('PartMasterListComponent', () => {
  let component: PartMasterListComponent;
  let fixture: ComponentFixture<PartMasterListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PartMasterListComponent]
    });
    fixture = TestBed.createComponent(PartMasterListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
