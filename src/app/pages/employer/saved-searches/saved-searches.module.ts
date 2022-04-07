import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SavedSearchesPageRoutingModule } from './saved-searches-routing.module';

import { SavedSearchesPage } from './saved-searches.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SavedSearchesPageRoutingModule
  ],
  declarations: [SavedSearchesPage]
})
export class SavedSearchesPageModule {}
