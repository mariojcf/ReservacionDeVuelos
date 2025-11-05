import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UploadXml } from './upload-xml';

describe('UploadXml', () => {
  let component: UploadXml;
  let fixture: ComponentFixture<UploadXml>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UploadXml]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UploadXml);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
