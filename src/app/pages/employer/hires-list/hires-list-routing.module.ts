import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HiresService } from 'src/app/services/hires.service';

import { HiresListPage } from './hires-list.page';

const routes: Routes = [
  {
    path: '',
    component: HiresListPage,
    resolve: {hires: HiresService}
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HiresListPageRoutingModule {}
