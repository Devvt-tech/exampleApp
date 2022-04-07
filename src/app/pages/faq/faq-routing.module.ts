import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { FaqService } from 'src/app/services/faq.service';

import { FaqPage } from './faq.page';

const routes: Routes = [
  {
    path: '',
    component: FaqPage,
    resolve: {questions: FaqService}
  },
  {
    path: 'faq-answer',
    loadChildren: () => import('./faq-answer/faq-answer.module').then( m => m.FaqAnswerPageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FaqPageRoutingModule {}
