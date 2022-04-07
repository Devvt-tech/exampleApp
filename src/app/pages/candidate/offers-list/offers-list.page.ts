import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { CandidateOfferComponent } from 'src/app/components/candidate-offer/candidate-offer.component';
import { IOffer } from 'src/app/interfaces/offer.interfaces';
import { CandidateOffersService } from 'src/app/services/candidate-offers.service';

@Component({
  selector: 'app-offers-list',
  templateUrl: './offers-list.page.html',
  styleUrls: ['./offers-list.page.scss'],
})
export class OffersListPage implements OnInit {

  headerHideOnScroll = false;
  headerFixOnScroll = false;
  isSearchOpened = false;

  isOffersOpened = true;
  isMessagesOpened = false;
  offers: IOffer[];

  constructor(
    private modalController: ModalController,
    private actRoute: ActivatedRoute,
    private candidateOffersService: CandidateOffersService
  ) {
    actRoute.data.subscribe(val => {
      this.offers = val.offers
    })
  }

  ngOnInit() {
  }

  async offerModal(offer: IOffer) {
    const modal = await this.modalController.create({
      component: CandidateOfferComponent,
      cssClass: 'fullpage-modal',
      componentProps: {
        offer: offer,
        view: false
      }
    });
    modal.onWillDismiss().then(async val => {
      this.offers = await (await this.candidateOffersService.loadCandidateOffers()).items;
    })
    return await modal.present();
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

  openSearch() {
    this.isSearchOpened = true;
  }

  closeSearch() {
    this.isSearchOpened = false;
  }

  showOffers() {
    this.isOffersOpened = true;
    this.isMessagesOpened = false;
  }

  showMessages() {
    this.isOffersOpened = false;
    this.isMessagesOpened = true;
  }

  segmentChanged($event) {
    
  }

}
