import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ChatPageRoutingModule } from './chat-routing.module';

import { ChatPage } from './chat.page';
import { ChatResolver } from './chat.resolver';
import { LongPressModule } from 'ionic-long-press';
import { Clipboard } from '@awesome-cordova-plugins/clipboard/ngx';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ChatPageRoutingModule,
    ReactiveFormsModule,
    LongPressModule
  ],
  declarations: [ChatPage],
  providers: [ChatResolver, Clipboard]
})
export class ChatPageModule {}
