import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { InterviewsPageRoutingModule } from './interviews-routing.module';

import { InterviewsPage } from './interviews.page';
import { ComponentsModule } from 'src/app/components/components.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    InterviewsPageRoutingModule,
    ComponentsModule
  ],
  declarations: [InterviewsPage]
})
export class InterviewsPageModule {}
