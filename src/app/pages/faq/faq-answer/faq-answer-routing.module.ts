import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { FaqAnswerPage } from './faq-answer.page';

const routes: Routes = [
  {
    path: '',
    component: FaqAnswerPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FaqAnswerPageRoutingModule {}
