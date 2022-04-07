import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { InterviewQuestionsPagePage } from './interview-questions-page.page';

const routes: Routes = [
  {
    path: '',
    component: InterviewQuestionsPagePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class InterviewQuestionsPagePageRoutingModule {}
