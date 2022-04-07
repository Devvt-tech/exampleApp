import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PositionsPage } from './positions.page';
import { VacanciesResolver } from './resolver';

const routes: Routes = [
  {
    path: '',
    component: PositionsPage,
    resolve: {vacancies: VacanciesResolver},
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PositionsPageRoutingModule {}
