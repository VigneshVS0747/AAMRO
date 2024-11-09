import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EncryptDecryptComponent } from './encrypt-decrypt.component';

describe('EncryptDecryptComponent', () => {
  let component: EncryptDecryptComponent;
  let fixture: ComponentFixture<EncryptDecryptComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EncryptDecryptComponent]
    });
    fixture = TestBed.createComponent(EncryptDecryptComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
