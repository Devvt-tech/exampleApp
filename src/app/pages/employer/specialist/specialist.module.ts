import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SpecialistPageRoutingModule } from './specialist-routing.module';

import { SpecialistPage } from './specialist.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SpecialistPageRoutingModule
  ],
  declarations: [SpecialistPage]
})
export class SpecialistPageModule {}
