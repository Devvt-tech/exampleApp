import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import * as moment from 'moment';
import { TYPE_OF_JOB } from 'src/constants';
import { CreateOfferRequest, IOffer, IOfferFilter } from '../interfaces/offer.interfaces';
import { ApiService } from './api.service';
import { CommonService } from './common.service';
import { ProfileService } from './profile.service';

@Injectable({
  providedIn: 'root'
})
export class CompanyOffersService implements Resolve<IOffer[]>{

  private typrOfJob = TYPE_OF_JOB;

  constructor(
    private apiService: ApiService,
    private profileService: ProfileService,
    private commonService: CommonService
  ) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<IOffer[]> {
    return this.loadCompanyOffers();
  }

  loadCompanyOffers() {
    return this.apiService.getCompanyOffers()
      .then(val => {
        const offers: IOffer[] = val.data.items;
        offers.forEach(offer => {
          offer.candidate.image= this.profileService.convertImagePath(offer.candidate.image, 'img');

          offer.jobName = this.typrOfJob[offer.job_id];
          //offer.expirienceText = this.commonService.getDifferentDatesText(offer.to.from, offer.to.to);
          offer.status = offer.status.trim();
          offer.statusColor = this.commonService.getStatusColor(offer.status);
          
           if (offer.dates && offer.dates.length === 0) {
             offer.prittyDateTime = `${moment().format('MM-DD-YYYY')} ${moment().format('hh:mm A')}`;
           } else {
             offer.prittyDateTime = `${moment(offer.dates[0]?.date, 'YYYY-MM-DD').format('MM-DD-YYYY')} ${moment(offer.dates[0]?.from_time, 'hh:mm').format('hh:mm A')}`;
           }
          
        })
        
        return offers;
      }).catch(err => {
        return new Array<IOffer>();
      });
  }

  async creatreOffer(request: CreateOfferRequest) {
    let response = false;
    await this.apiService.createOffer(request).then(val => {
      response = true;
    }).catch(err => {
      response = false;
    });
    return response;
  }

  async blockOffer(userId: number ) {
    let response = false;
    await this.apiService.blockOffer(userId).then(val => {
      response = true;
    }).catch(err => {
      response = false;
    });
    return response;
  }

  async filterOffer(filter: IOfferFilter) {
    let response: IOffer[] = [];
    await this.apiService.filterOffer(filter).then(val => {
      val.forEach(offer => {
        offer.to.image = this.profileService.convertImagePath(offer.to.image, 'img');
        offer.jobName = this.typrOfJob[offer.job_id];
        offer.expirienceText = this.commonService.getDifferentDatesText(offer.to.from, offer.to.to);
        offer.status = offer.status.trim();
        offer.statusColor = this.commonService.getStatusColor(offer.status)
      })
      response = val;
    }).catch(err => {
    });
    return response;
  }

  async cancelOffer(offerId: number ) {
    let response = false;
    await this.apiService.cancelOffer(offerId).then(val => {
      response = true;
    }).catch(err => {
      response = false;
    });
    return response;
  }

  async archiveOffer(offerId: number) {
    let response = false;
    await this.apiService.archiveOffer(offerId).then(val => {
      response = true;
    }).catch(err => {
      response = false;
    });
    return response;
  }

  async editOffer(request: CreateOfferRequest) {
    let response = false;
    await this.apiService.editOffer(request).then(val => {
      response = true;
    }).catch(err => {
      response = false;
    });
    return response;
  }

}
