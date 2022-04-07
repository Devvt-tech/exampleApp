import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CandidateOffersService } from 'src/app/services/candidate-offers.service';

import { OffersListPage } from './offers-list.page';

const routes: Routes = [
  {
    path: '',
    component: OffersListPage,
    resolve: {offers: CandidateOffersService}
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class OffersListPageRoutingModule {}
