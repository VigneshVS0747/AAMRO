import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JoebDocumentDialogComponent } from './joeb-document-dialog.component';

describe('JoebDocumentDialogComponent', () => {
  let component: JoebDocumentDialogComponent;
  let fixture: ComponentFixture<JoebDocumentDialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [JoebDocumentDialogComponent]
    });
    fixture = TestBed.createComponent(JoebDocumentDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
