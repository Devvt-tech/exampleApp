import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CertificatesService } from 'src/app/services/certificates.service';
import { ResumeResolverService } from 'src/app/services/resume-resolver.service';

import { LicensesCertificationsResumePage } from './licenses-certifications-resume.page';

const routes: Routes = [
  {
    path: '',
    component: LicensesCertificationsResumePage,
    resolve: {resumePath: ResumeResolverService, certificates: CertificatesService}
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LicensesCertificationsResumePageRoutingModule {}
