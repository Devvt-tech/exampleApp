import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CompanyOffersService } from 'src/app/services/company-offers.service';

import { OffersListPage } from './offers-list.page';

const routes: Routes = [
  {
    path: '',
    component: OffersListPage,
    resolve: {offers: CompanyOffersService}
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class OffersListPageRoutingModule {}
