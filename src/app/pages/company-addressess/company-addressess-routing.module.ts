import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AddressService } from 'src/app/services/address.service';

import { CompanyAddressessPage } from './company-addressess.page';

const routes: Routes = [
  {
    path: '',
    component: CompanyAddressessPage,
    resolve: {addresses: AddressService}
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CompanyAddressessPageRoutingModule {}
