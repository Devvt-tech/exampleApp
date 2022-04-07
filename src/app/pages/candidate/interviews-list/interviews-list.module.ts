import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { InterviewsListPageRoutingModule } from './interviews-list-routing.module';

import { InterviewsListPage } from './interviews-list.page';
import { ComponentsModule } from 'src/app/components/components.module';
import { CalendarModule } from 'ion2-calendar';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    InterviewsListPageRoutingModule,
    ComponentsModule,
    CalendarModule,
    ComponentsModule,
    ReactiveFormsModule
  ],
  declarations: [InterviewsListPage]
})
export class InterviewsListPageModule {}
