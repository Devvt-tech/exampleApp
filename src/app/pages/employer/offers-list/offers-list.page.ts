import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ModalController, PopoverController } from '@ionic/angular';
import * as moment from 'moment';
import { CandidateOfferComponent } from 'src/app/components/candidate-offer/candidate-offer.component';
import { OfferSentActionsComponent } from 'src/app/components/offer-sent-actions/offer-sent-actions.component';
import { OffersFilterComponent } from 'src/app/components/offers-filter/offers-filter.component';
import { IOffer, IOfferFilter } from 'src/app/interfaces/offer.interfaces';
import { CompanyOffersService } from 'src/app/services/company-offers.service';
import { DataService } from 'src/app/services/data.service';
import { ToastService } from 'src/app/services/toast.service';

@Component({
  selector: 'app-offers-list',
  templateUrl: './offers-list.page.html',
  styleUrls: ['./offers-list.page.scss'],
})
export class OffersListPage implements OnInit {

  headerHideOnScroll = false;
  headerFixOnScroll = false;
  isSearchOpened = false;
  offers: IOffer[];
  filter: IOfferFilter = {
    aviability: 0,
    from: null,
    position: 0,
    search: '',
    status: 0,
    to: null
  }
  filtersCount = 0;
  searchText: string;

  constructor(
    private popoverController: PopoverController,
    private modalController: ModalController,
    private actRoute: ActivatedRoute,
    private companyOffersService: CompanyOffersService,
    private toastService: ToastService,
    private ds: DataService,
    private router: Router
  ) {
    actRoute.data.subscribe(data => {
      this.offers = data.offers;
    })
  }

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

  openSearch() {
    this.isSearchOpened = true;
  }

  closeSearch() {
    this.isSearchOpened = false;
  }

  async offerSentActions(ev: any, userId: number, offer: IOffer) {
    const popover = await this.popoverController.create({
      component: OfferSentActionsComponent,
      // cssClass: 'info-popover',
      event: ev,
      translucent: false,
      mode: 'md',
      componentProps: {
        userId: userId,
        offer: offer
      }
    });
    popover.onDidDismiss().then(async val=> {
      if (val.role === 'ok') {
        this.offers = await this.companyOffersService.loadCompanyOffers();
      }
    })
    await popover.present();

    //const { role } = await popover.onDidDismiss();
    // console.log('onDidDismiss resolved with role', role);
  }

  async openFilter() {
    const modal = await this.modalController.create({
      component: OffersFilterComponent,
      cssClass: 'fullpage-modal',
      componentProps: {
        filter: this.filter
      }
    });
    modal.onDidDismiss().then(val => {

      if (val.data.apply) {
        this.filter = val.data.filter;
        this.filtersCount = val.data.filtersCount;
        this.applyFilter();
      }
    })
    return await modal.present();

  }

  async applyFilter(search?: string) {
    this.filter.search = search;
    const fromMom = moment(this.filter.from);
    const toMom = moment(this.filter.to);
    if (fromMom.isValid()) {
      this.filter.from = fromMom.format('YYYY-MM-DD');
    }
    if (toMom.isValid()) {
      this.filter.to = toMom.format('YYYY-MM-DD');
    }
    const result = await this.companyOffersService.filterOffer(this.filter);
    this.offers = result;
  }

  searchChange(event) {
    const text = event.detail.value;
    this.applyFilter(text);
  }

  async cancelClick(offerId: number) {
    const result = await this.companyOffersService.cancelOffer(offerId)
    if (result) {
      this.toastService.showSuccessToast();
      if (this.filtersCount > 0 && this.searchText.length > 0) {
        this.offers = await this.companyOffersService.filterOffer(this.filter);
      } else {
        this.offers = await this.companyOffersService.loadCompanyOffers();
      }
    }
  }

  async viewOffer(offer: IOffer) {
    const modal = await this.modalController.create({
      component: CandidateOfferComponent,
      cssClass: 'fullpage-modal',
      componentProps: {
        offer: offer,
        view: false
      }
    });
    modal.onWillDismiss().then(async val => {
      this.offers = await this.companyOffersService.loadCompanyOffers()
    })
    return await modal.present();
  }


}
