import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationExtras, Route, Router } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { ContactUsComponent } from 'src/app/components/contact-us/contact-us.component';
import { IFaqQuestion } from 'src/app/interfaces/faq.interfaces';

@Component({
  selector: 'app-faq',
  templateUrl: './faq.page.html',
  styleUrls: ['./faq.page.scss'],
})
export class FaqPage implements OnInit {

  questions: IFaqQuestion[];

  constructor(
    private modalController: ModalController,
    private actRoute: ActivatedRoute,
    private router: Router
  ) {
    actRoute.data.subscribe(data => {
      this.questions = data.questions;
    })
  }

  ngOnInit() {
  }

  async contactUsModal() {
    const modal = await this.modalController.create({
      component: ContactUsComponent,
      cssClass: 'fullpage-modal'
    });
    return await modal.present();
  }

  onClick(question: IFaqQuestion) {
    const ext: NavigationExtras = {
      state: {ques: question}
    }
    this.router.navigate([`/faq/faq-answer`], ext);
  }

}
