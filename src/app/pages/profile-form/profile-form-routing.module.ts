import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AddressService } from 'src/app/services/address.service';
import { CertificatesService } from 'src/app/services/certificates.service';
import { ProfileService } from 'src/app/services/profile.service';
import { QuizzesService } from 'src/app/services/quizzes.service';
import { ResumeResolverService } from 'src/app/services/resume-resolver.service';

import { ProfileFormPage } from './profile-form.page';

const routes: Routes = [
  {
    path: '',
    component: ProfileFormPage,
    resolve: {user: ProfileService, quizzes: QuizzesService, resumePath: ResumeResolverService, certificates: CertificatesService, addresses: AddressService}
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProfileFormPageRoutingModule {}
