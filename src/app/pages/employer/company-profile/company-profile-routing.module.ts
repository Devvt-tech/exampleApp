import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AddressService } from 'src/app/services/address.service';
import { AvailabilityService } from 'src/app/services/availability.service';
import { MessagesService } from 'src/app/services/messages.service';
import { ProfileService } from 'src/app/services/profile.service';
import { RatingService } from 'src/app/services/rating.service';

import { CompanyProfilePage } from './company-profile.page';

const routes: Routes = [
  {
    path: ':id',
    component: CompanyProfilePage,
    resolve: {user: ProfileService, rating: RatingService}
  },
  {
    path: '',
    component: CompanyProfilePage,
    resolve: {user: ProfileService, rating: RatingService, addresses: AddressService, chatList: MessagesService}
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CompanyProfilePageRoutingModule {}
