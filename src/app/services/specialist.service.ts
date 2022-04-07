import { Injectable } from '@angular/core';
import { IGenericCommonResponse, IUser } from '../interfaces/common.interface';
import { ApiService } from './api.service';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { DataService } from './data.service';
import { StorageService } from './storage.service';
import { ISpecialistFilter, ISpecialistFilterRequest } from '../interfaces/specialist.interfaces';
import { FormControl, FormGroup } from '@angular/forms';
import { CommonService } from './common.service';
import { ToastService } from './toast.service';
import { isNull } from '@angular/compiler/src/output/output_ast';

@Injectable({
  providedIn: 'root'
})
export class SpecialistService implements Resolve<IUser[]> {

  constructor(
    private apiService: ApiService,
    private ds: DataService,
    private storageService: StorageService,
    private commonService: CommonService,
    private toastService: ToastService
  ) { }


  async resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<IUser[]> {
    this.ds.token = this.ds.token || await this.storageService.getTokenFromStorage();
    const par = route.params.pageType;
    return par ? this.loadSavedSpecialists() : this.loadSpecialistList();
  }

  loadSpecialistList() {
    const result: IUser[] = [];
    return this.apiService.getSpecialist().then(val => {
      return val;
    }).catch(err => {
      return result
    })
  }

  loadSavedSpecialists() {
    const result: IUser[] = [];
    return this.apiService.getSavedSpecialist().then(val => {
      return val;
    }).catch(err => {
      return result
    })
  }

  filterSpecialist(model: ISpecialistFilter) {
    const request: ISpecialistFilterRequest = {
      full_time: model.full_time ? 1 : 0,
      part_time : model.part_time ? 1 : 0,
      on_demand: model.on_demand ? 1: 0,
      query_text: model.name,
      experience: model.experience,
      city: model.city
    }

    let query = `full_time=${request.full_time}&part_time=${request.part_time}&on_demand=${request.on_demand}`;

    query = model.experience && model.experience !== 'all' ? query + `&experience=${request.experience}` : query;
    query = request.query_text ? query + `&query_text=${request.query_text.toString()}` : query;
    query = request.city ? query + `&city=${request.city}` : query;

    model.areas && model.areas.forEach(val => {
      query = query + `&areas[]=${val}`;
    })

    if (model.covid === true || model.covid === false) {
      query = query + `&covid=${model.covid ? 1 : 0}`;
    }
    
    query = model.ratingFrom ? query + `&rating_from=${model.ratingFrom}` : query;
    query = model.ratingTo ? query + `&rating_to=${model.ratingTo}` : query;
    query = model.sort_by ? query + `&sort_by=${model.sort_by}` : query;
    query = model.job_name ? query + `&job_name=${model.job_name}` : query;

    let result: IUser[] = [];
    return this.apiService.filterSpecialist(request, query).then(val => {
      if (val['errors']) {
        result['error'] = this.commonService.transformServerErrorV2(val['errors']);
        this.toastService.showToast(result['error']);
      } else {
        result = val;
      }
      return result;
    }).catch(err => {
      this.toastService.showToast(this.commonService.transformServerErrorV2(err));
      return result
    })
  }

  buildFilterForm(filter?: ISpecialistFilter) {
    const result = new FormGroup({
      sort_by: new FormControl(filter?.sort_by || null),
      experience: new FormControl(filter?.experience || null),
      city: new FormControl(filter?.city || null),
      areas: new FormControl(filter?.areas || []),
      ratingFrom: new FormControl(filter?.ratingFrom || ''),
      ratingTo: new FormControl(filter?.ratingTo || ''),
      covid: new FormControl(filter?.covid),
      job_name: new FormControl(filter?.job_name)
    });
    return result;
  }
}
