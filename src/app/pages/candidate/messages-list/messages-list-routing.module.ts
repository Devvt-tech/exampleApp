import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MessagesService } from 'src/app/services/messages.service';

import { MessagesListPage } from './messages-list.page';

const routes: Routes = [
  {
    path: '',
    component: MessagesListPage,
    resolve: {chatList: MessagesService}
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MessagesListPageRoutingModule {}
