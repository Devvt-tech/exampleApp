import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ProfileService } from 'src/app/services/profile.service';
import { SpecialistService } from 'src/app/services/specialist.service';

import { SpecialistsPage } from './specialists.page';

const routes: Routes = [
  {
    path: '',
    component: SpecialistsPage,
    resolve: {spesialists: SpecialistService, user: ProfileService}
  },
  {
    path: ':pageType',
    component: SpecialistsPage,
    resolve: {spesialists: SpecialistService, user: ProfileService}
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SpecialistsPageRoutingModule {}
