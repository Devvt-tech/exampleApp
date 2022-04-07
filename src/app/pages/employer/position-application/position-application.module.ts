import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PositionApplicationPageRoutingModule } from './position-application-routing.module';

import { PositionApplicationPage } from './position-application.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PositionApplicationPageRoutingModule
  ],
  declarations: [PositionApplicationPage]
})
export class PositionApplicationPageModule {}
