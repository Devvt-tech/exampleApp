import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { LicensesCertificationsResumePageRoutingModule } from './licenses-certifications-resume-routing.module';

import { LicensesCertificationsResumePage } from './licenses-certifications-resume.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    LicensesCertificationsResumePageRoutingModule
  ],
  declarations: [LicensesCertificationsResumePage]
})
export class LicensesCertificationsResumePageModule {}
