import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { FaqAnswerPageRoutingModule } from './faq-answer-routing.module';

import { FaqAnswerPage } from './faq-answer.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    FaqAnswerPageRoutingModule
  ],
  declarations: [FaqAnswerPage]
})
export class FaqAnswerPageModule {}
