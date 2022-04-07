import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PositionPageRoutingModule } from './position-routing.module';

import { PositionPage } from './position.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PositionPageRoutingModule
  ],
  declarations: [PositionPage]
})
export class PositionPageModule {}
