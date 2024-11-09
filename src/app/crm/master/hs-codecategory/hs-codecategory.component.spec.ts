import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HsCodecategoryComponent } from './hs-codecategory.component';

describe('HsCodecategoryComponent', () => {
  let component: HsCodecategoryComponent;
  let fixture: ComponentFixture<HsCodecategoryComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [HsCodecategoryComponent]
    });
    fixture = TestBed.createComponent(HsCodecategoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
