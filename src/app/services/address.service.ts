import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { IAddress } from '../interfaces/address.intertfaces';
import { IGenericCommonResponse } from '../interfaces/common.interface';
import { ApiService } from './api.service';
import { CommonService } from './common.service';
import { DataService } from './data.service';
import { StorageService } from './storage.service';

@Injectable({
  providedIn: 'root'
})
export class AddressService implements Resolve<IAddress[]> {

  constructor(
    private apiService: ApiService,
    private commonService: CommonService,
    private ds: DataService,
    private storageService: StorageService,
  ) { }

  async resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<IAddress[]> {
    const response = this.ds.isCompany ? await this.loadAdressess() : [];
    return response;
  }

  async loadAdressess() {
    if (this.ds.isCompany) {
      this.ds.token = this.ds.token || await this.storageService.getTokenFromStorage()
      return this.apiService.loadAddresses().then(val => {
        return val.data.items
      })
    } else {
      return new Promise<IAddress[]>((resolve, reject) => {
        resolve([])
      })
    }

  }

  async createAddress(model: IAddress) {
    let result: IGenericCommonResponse<boolean> = {};
    await this.apiService.createAddress(model).then(val => {
      if (val.errors && val.errors.length) {
        result.error = this.commonService.transformServerErrorV2(val.errors);
        result.data = false
      } else {
        result.data = true;
      }
    }).catch(err => {
      result.errors = this.commonService.transformServerErrorV2(err.error.errors, err);
      result.data = false;
    })
    return result;
  }

  async editAddress(model: IAddress) {
    let result: IGenericCommonResponse<boolean> = {};
    await this.apiService.editAddress(model).then(val => {
      if (val.errors && val.errors.length) {
        result.error = this.commonService.transformServerErrorV2(val.errors);
        result.data = false
      } else {
        result.data = true;
      }
    }).catch(err => {
      result.errors = this.commonService.transformServerErrorV2(err.error.errors, err);
      result.data = false;
    })
    return result;
  }

  deleteAddress(id: number) {
    return this.apiService.deleteAddress(id).then(val => {
      return true;
    }).catch(err => {
      return false;
    })
  }

}
