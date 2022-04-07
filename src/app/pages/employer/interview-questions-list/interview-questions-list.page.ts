import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { AddQuestionsListComponent } from 'src/app/components/add-questions-list/add-questions-list.component';

@Component({
  selector: 'app-interview-questions-list',
  templateUrl: './interview-questions-list.page.html',
  styleUrls: ['./interview-questions-list.page.scss'],
})
export class InterviewQuestionsListPage implements OnInit {

  constructor(
    private modalController: ModalController
  ) { }

  ngOnInit() {
  }

  async addQuestionsList() {
    const modal = await this.modalController.create({
      component: AddQuestionsListComponent,
      cssClass: 'fullpage-modal'
    });
    return await modal.present();
  }

}
