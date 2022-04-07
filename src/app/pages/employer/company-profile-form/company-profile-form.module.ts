import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CompanyProfileFormPageRoutingModule } from './company-profile-form-routing.module';

import { CompanyProfileFormPage } from './company-profile-form.page';
import { ComponentsModule } from 'src/app/components/components.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CompanyProfileFormPageRoutingModule,
    ComponentsModule,
  ],
  declarations: [CompanyProfileFormPage]
})
export class CompanyProfileFormPageModule {}
