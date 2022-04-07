import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { IGetRatingResponse, IRatingResponse } from '../interfaces/rating.interfaces';
import { ApiService } from './api.service';
import { CommonService } from './common.service';
import { DataService } from './data.service';
import { StorageService } from './storage.service';
import { ToastService } from './toast.service';

@Injectable({
  providedIn: 'root'
})
export class RatingService implements Resolve<number> {

  constructor(
    private apiService: ApiService,
    private commonService: CommonService,
    private toastService: ToastService,
    private ds: DataService,
    private storageService: StorageService
  ) { }
  async resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<number> {
    this.ds.token = this.ds.token || await this.storageService.getTokenFromStorage()
    return await this.loadRating();
  }

  async loadRating() {
    let response: IGetRatingResponse = {};
    await this.apiService.getRating().then(val => {
      response = val
      if (response.errors && response.errors.length > 0) {
        this.toastService.showToast(this.commonService.transformServerErrorV2(response.errors));
      }
    }).catch(err => {
      response.error = this.commonService.transformServerErrorV2(err);
    });
    return response.data.user_rating.assessment_total
  }
}
