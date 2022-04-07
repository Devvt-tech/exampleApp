import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { LicensesCertificationsResumePage } from './licenses-certifications-resume.page';

describe('LicensesCertificationsResumePage', () => {
  let component: LicensesCertificationsResumePage;
  let fixture: ComponentFixture<LicensesCertificationsResumePage>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ LicensesCertificationsResumePage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(LicensesCertificationsResumePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
