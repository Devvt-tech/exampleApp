import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PositionApplicationPage } from './position-application.page';

const routes: Routes = [
  {
    path: '',
    component: PositionApplicationPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PositionApplicationPageRoutingModule {}
