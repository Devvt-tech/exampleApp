import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CompanyProfilePageRoutingModule } from './company-profile-routing.module';

import { CompanyProfilePage } from './company-profile.page';
import { ComponentsModule } from 'src/app/components/components.module';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CompanyProfilePageRoutingModule,
    ComponentsModule
  ],
  declarations: [CompanyProfilePage],
  providers: [
    InAppBrowser
  ]
})
export class CompanyProfilePageModule {}
