import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SpecialistPage } from './specialist.page';

const routes: Routes = [
  {
    path: '',
    component: SpecialistPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SpecialistPageRoutingModule {}
