import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { HireStatusEnum, IHire, ISaveReviewRequest } from '../interfaces/hires.interface';
import { ApiService } from './api.service';
import { CommonService } from './common.service';
import { ProfileService } from './profile.service'

@Injectable({
  providedIn: 'root'
})
export class HiresService implements Resolve<IHire[]> {

  constructor(
    private apiService: ApiService,
    private commonService: CommonService,
    private profileService: ProfileService
  ) { }
  async resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<IHire[]> {
    return await this.getHires();
  }

  getHires() {
    let result: IHire[] = [];
    return this.apiService.getHires().then(resp => {
      resp.data.hires.forEach(hire => {
        hire.candidate.image = this.profileService.convertImagePath(hire.candidate.image, 'img');
        hire.company.image = this.profileService.convertImagePath(hire.company.image, 'img');
        hire.hireStatusText = HireStatusEnum[hire.hired_status];
      })
      result = resp.data.hires;
      return result;
    })
    .catch(error => {
      return result
    })
  }

  setHireAnswer(offerId, answer: boolean) {
    return this.apiService.hiredAanswer(offerId, answer).then(val => {
      return true
    }).catch(err => {
      return false
    })
  }

  saveReview(offerId: number, model: ISaveReviewRequest) {
    this.apiService.leaveRating(offerId, model).then(val => {
      // TODO
    }).catch(err => {
    })
  }

}
