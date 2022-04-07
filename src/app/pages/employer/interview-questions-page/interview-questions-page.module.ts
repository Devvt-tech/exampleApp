import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { InterviewQuestionsPagePageRoutingModule } from './interview-questions-page-routing.module';

import { InterviewQuestionsPagePage } from './interview-questions-page.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    InterviewQuestionsPagePageRoutingModule
  ],
  declarations: [InterviewQuestionsPagePage]
})
export class InterviewQuestionsPagePageModule {}
