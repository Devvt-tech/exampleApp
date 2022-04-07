import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { InterviewQuestionsListPage } from './interview-questions-list.page';

const routes: Routes = [
  {
    path: '',
    component: InterviewQuestionsListPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class InterviewQuestionsListPageRoutingModule {}
