import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CompanyProfileFormPage } from './company-profile-form.page';

const routes: Routes = [
  {
    path: '',
    component: CompanyProfileFormPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CompanyProfileFormPageRoutingModule {}
