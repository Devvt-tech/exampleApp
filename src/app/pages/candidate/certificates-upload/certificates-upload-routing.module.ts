import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CertificatesUploadPage } from './certificates-upload.page';

const routes: Routes = [
  {
    path: ':type',
    component: CertificatesUploadPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CertificatesUploadPageRoutingModule {}
