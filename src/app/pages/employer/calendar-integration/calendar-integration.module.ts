import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CalendarIntegrationPageRoutingModule } from './calendar-integration-routing.module';

import { CalendarIntegrationPage } from './calendar-integration.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CalendarIntegrationPageRoutingModule
  ],
  declarations: [CalendarIntegrationPage]
})
export class CalendarIntegrationPageModule {}
