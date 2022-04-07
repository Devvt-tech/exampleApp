import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ChatPage } from './chat.page';
import { ChatResolver } from './chat.resolver';

const routes: Routes = [
  {
    path: ':id',
    component: ChatPage,
    resolve: {messagesInfo: ChatResolver}
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ChatPageRoutingModule {}
