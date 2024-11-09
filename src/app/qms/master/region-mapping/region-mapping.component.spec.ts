import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegionMappingComponent } from './region-mapping.component';

describe('RegionMappingComponent', () => {
  let component: RegionMappingComponent;
  let fixture: ComponentFixture<RegionMappingComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RegionMappingComponent]
    });
    fixture = TestBed.createComponent(RegionMappingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
