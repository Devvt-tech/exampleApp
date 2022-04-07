import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { OffersListPageRoutingModule } from './offers-list-routing.module';

import { OffersListPage } from './offers-list.page';
import { ComponentsModule } from 'src/app/components/components.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    OffersListPageRoutingModule,
    ComponentsModule
  ],
  declarations: [OffersListPage]
})
export class OffersListPageModule {}
