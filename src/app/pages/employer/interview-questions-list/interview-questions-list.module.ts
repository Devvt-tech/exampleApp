import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { InterviewQuestionsListPageRoutingModule } from './interview-questions-list-routing.module';

import { InterviewQuestionsListPage } from './interview-questions-list.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    InterviewQuestionsListPageRoutingModule
  ],
  declarations: [InterviewQuestionsListPage]
})
export class InterviewQuestionsListPageModule {}
