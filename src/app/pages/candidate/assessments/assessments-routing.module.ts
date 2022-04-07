import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { QuizzesService } from 'src/app/services/quizzes.service';

import { AssessmentsPage } from './assessments.page';

const routes: Routes = [
  {
    path: '',
    component: AssessmentsPage,
    resolve: {quizzes: QuizzesService}
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AssessmentsPageRoutingModule {}
