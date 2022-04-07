import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PushService } from 'src/app/services/push.service';

import { NotificationsPage } from './notifications.page';

const routes: Routes = [
  {
    path: '',
    component: NotificationsPage,
    resolve: {pushes: PushService}
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class NotificationsPageRoutingModule {}
