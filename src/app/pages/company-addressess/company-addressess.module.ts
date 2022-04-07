import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CompanyAddressessPageRoutingModule } from './company-addressess-routing.module';

import { CompanyAddressessPage } from './company-addressess.page';
import { ComponentsModule } from 'src/app/components/components.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CompanyAddressessPageRoutingModule,
    ComponentsModule
  ],
  declarations: [CompanyAddressessPage]
})
export class CompanyAddressessPageModule {}
