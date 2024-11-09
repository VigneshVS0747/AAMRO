import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DocumentMappingComponent } from './document-mapping.component';

describe('DocumentMappingComponent', () => {
  let component: DocumentMappingComponent;
  let fixture: ComponentFixture<DocumentMappingComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DocumentMappingComponent]
    });
    fixture = TestBed.createComponent(DocumentMappingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
