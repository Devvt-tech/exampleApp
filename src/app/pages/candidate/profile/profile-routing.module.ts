import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CertificatesService } from 'src/app/services/certificates.service';
import { MessagesService } from 'src/app/services/messages.service';
import { ProfileService } from 'src/app/services/profile.service';
import { QuizzesService } from 'src/app/services/quizzes.service';
import { RatingService } from 'src/app/services/rating.service';
import { ResumeResolverService } from 'src/app/services/resume-resolver.service';

import { ProfilePage } from './profile.page';

const routes: Routes = [
  {
    path: '',
    component: ProfilePage,
    resolve: {user: ProfileService, quizzes: QuizzesService, resumePath: ResumeResolverService, certificates: CertificatesService, rating: RatingService, chatList: MessagesService}
  },
  {
    path: ':id',
    component: ProfilePage,
    resolve: {user: ProfileService, quizzes: QuizzesService, resumePath: ResumeResolverService, certificates: CertificatesService}
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProfilePageRoutingModule {}
