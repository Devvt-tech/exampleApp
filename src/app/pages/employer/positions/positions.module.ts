import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { PositionsPageRoutingModule } from './positions-routing.module';
import { PositionsPage } from './positions.page';
import { VacanciesResolver } from './resolver';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PositionsPageRoutingModule
  ],
  declarations: [PositionsPage],
  providers: [VacanciesResolver]
})
export class PositionsPageModule {}
