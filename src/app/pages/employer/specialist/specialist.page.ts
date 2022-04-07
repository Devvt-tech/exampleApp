import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { MakeOfferComponent } from 'src/app/components/make-offer/make-offer.component';

@Component({
  selector: 'app-specialist',
  templateUrl: './specialist.page.html',
  styleUrls: ['./specialist.page.scss'],
})
export class SpecialistPage implements OnInit {
  headerHideOnScroll = false;
  headerFixOnScroll = false;

  isBookmark: boolean;

  constructor(
    public modalController: ModalController,
  ) { }

  ngOnInit() {
  }

  onScroll(event) {   
    if (event.detail.scrollTop > 0) {      
      this.headerHideOnScroll = true;
      this.headerFixOnScroll = false;
      
      if (event.detail.deltaY <= 0 && event.detail.scrollTop > 100) {
        this.headerHideOnScroll = false;
        this.headerFixOnScroll = true;
      }
      
    } else {
      this.headerHideOnScroll = false;
      this.headerFixOnScroll = false;
    }
  }

  bookmark() {
    this.isBookmark = !this.isBookmark;
  }

  async makeOfferModal() {
    const modal = await this.modalController.create({
      component: MakeOfferComponent,
      cssClass: 'fullpage-modal'
    });
    return await modal.present();
  }

}
