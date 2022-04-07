import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { IAvailabilities, IAvailability, IAvailabilityInterval, IAvailabilityResponse, IAvilabilitySaveRequest } from '../interfaces/common.interface';
import { ApiService } from './api.service';
import { ToastService } from './toast.service';

@Injectable({
  providedIn: 'root'
})
export class AvailabilityService {

  constructor(
    private apiService: ApiService,
    private toastService: ToastService
  ) { }

  loadInfo() {
    let result: IAvailabilities;
    return this.apiService.getAvailability().then(val => {
      return this.parseResponse(val);
    }).catch(err => {
      return result
    })
  }

  parseResponse(val: IAvailabilityResponse) {
    let result: IAvailabilities = {}
    const empty: IAvailabilityInterval = {
      start: '',
      end: ''
    };

    result.monday = val.monday ? {on: true, intervals: val.monday} : {on: false, intervals: [empty]};
    result.tuesday = val.tuesday ? {on: true, intervals: val.tuesday} : {on: false, intervals: [empty]};
    result.wednesday = val.wednesday ? {on: true, intervals: val.wednesday} : {on: false, intervals: [empty]};
    result.thursday = val.thursday ? {on: true, intervals: val.thursday} : {on: false, intervals: [empty]};
    result.friday = val.friday ? {on: true, intervals: val.friday} : {on: false, intervals: [empty]};
    result.saturday = val.saturday ? {on: true, intervals: val.saturday} : {on: false, intervals: [empty]};
    result.sunday = val.sunday ? {on: true, intervals: val.sunday} : {on: false, intervals: [empty]};
    return result;
  }

  saveAviabilities(request: IAvilabilitySaveRequest) {
    return this.apiService.setAvailabilities(request).then(val => {
     return val;
    }).catch(err => {
      const text: string = err.error[0];
      this.toastService.showToast(text)
      return text;
    })
  }
}
