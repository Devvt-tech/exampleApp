import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import * as moment from 'moment';
import { TYPE_OF_JOB } from 'src/constants';
import { IOfferDate, IOffer, IProposeDateTimeRequest } from '../interfaces/offer.interfaces';
import { ApiService } from './api.service';
import { DataService } from './data.service';

@Injectable({
  providedIn: 'root'
})
export class CandidateOffersService implements Resolve<IOffer[]>{

  private typrOfJob = TYPE_OF_JOB;

  constructor(
    private apiService: ApiService,
    private ds: DataService
  ) { }

  async resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<IOffer[]> {
    const list = await this.loadCandidateOffers();
    return list.items
  }

  loadCandidateOffers() {
    return this.apiService.getCandidateOffers()
    .then(val => {
      this.setJobAndDate(val.data.items);
      return val.data;
    });
  }

  loadOfferById(id: number) {
    return this.apiService.getOfferById(id)
    .then(val => {
      this.setJobAndDate([val.data])
      return val.data;
    });
  }

  setJobAndDate(offers: IOffer[]) {
    offers.forEach(offer => {
      offer.jobName = this.typrOfJob[offer.job_id];

      if (offer.dates && offer.dates.length === 0) {
        ///// TODO remove
        const d: IOfferDate = {
          from_time: moment().unix().toString(),
          to_time: moment().unix().toString(),
          date: moment().unix().toString(),
          slot: null
        }
        offer.dates.push(d)
        offer.prittyDateTime = `${moment().format('MM-DD-YYYY')} ${moment().format('hh:mm A')}`;
      } else {
        offer.prittyDateTime = `${moment(offer.dates[0].date, 'YYYY-MM-DD').format('MM-DD-YYYY')} ${moment(offer.dates[0]?.from_time, 'hh:mm').format('hh:mm A')}`;
      }
    })
  }

  acceptOffer(id: number, sendResume: boolean, date_id: number, message: string) {
    return this.apiService.acceptOffer(id, sendResume, date_id, message)
    .then(val => {
      return true;
    }).catch(val => {
      return false;
    });
  }

  rejectOffer(id: number) {
    return this.apiService.rejectOffer(id)
    .then(val => {
      return true;
    }).catch(val => {
      return false;
    });
  }

  async proposeNewDateTime(request: IProposeDateTimeRequest) {
    return await this.apiService.proposeNewDateTime(request).then(val => {
      return true;
    }).catch(err => {
      return false;
    });
  }

  async markOfferAsRead(id: number) {
    return await this.apiService.markOfferAsRead(id).then(val => {
      return true;
    }).catch(err => {
      return false;
    });
  }

}
