import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { QuizzService } from 'src/app/services/quizz.service';

import { QuizPage } from './quiz.page';

const routes: Routes = [
  {
    path: ':id',
    component: QuizPage,
    resolve: {data: QuizzService} 
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class QuizPageRoutingModule {}
