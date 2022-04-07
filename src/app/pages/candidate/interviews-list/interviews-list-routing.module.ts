import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { InterviewsListPage } from './interviews-list.page';

const routes: Routes = [
  {
    path: '',
    component: InterviewsListPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class InterviewsListPageRoutingModule {}
