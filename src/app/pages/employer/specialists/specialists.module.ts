import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SpecialistsPageRoutingModule } from './specialists-routing.module';

import { SpecialistsPage } from './specialists.page';
import { ComponentsModule } from 'src/app/components/components.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SpecialistsPageRoutingModule,
    ComponentsModule,
    ReactiveFormsModule
  ],
  declarations: [SpecialistsPage]
})
export class SpecialistsPageModule {}
