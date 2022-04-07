import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { HiresListPageRoutingModule } from './hires-list-routing.module';

import { HiresListPage } from './hires-list.page';
import { ComponentsModule } from 'src/app/components/components.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HiresListPageRoutingModule,
    ComponentsModule
  ],
  declarations: [HiresListPage]
})
export class HiresListPageModule {}
