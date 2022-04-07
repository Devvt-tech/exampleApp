import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PositionPage } from './position.page';

const routes: Routes = [
  {
    path: '',
    component: PositionPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PositionPageRoutingModule {}
