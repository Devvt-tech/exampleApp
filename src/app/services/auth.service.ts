import { Injectable } from '@angular/core';
import { IForgotRequest, IForgotResponse, ILoginRequest, ILoginResponse, IRegisterRequest, IRegisterResponse } from '../interfaces/auth.interface';
import { IGenericCommonResponse } from '../interfaces/common.interface';
import { ApiService } from './api.service';
import { CommonService } from './common.service';
import { DataService } from './data.service';
import { StorageService } from './storage.service';
import { FingerprintAIO } from '@ionic-native/fingerprint-aio/ngx';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(
    private apiService: ApiService,
    private commonService: CommonService,
    private storageService: StorageService,
    private ds: DataService,
    private faio: FingerprintAIO
  ) { }

  async register(model: IRegisterRequest) {
    if (model.phone.substr(0,1) !== '+' ) {
      model.phone = `+${model.phone}`
    }
    let result: IGenericCommonResponse<IRegisterResponse> = {};
    await this.apiService.register(model).then(val => {
      result.data = val;
      this.storageService.setTokenToStorage(result.data.token);
      this.ds.token = result.data.token;
      this.storageService.setCredentialToStorage({field1: model.phone, field2: model.password});
      this.ds.token = result.data.token;
    }).catch(err => {
      result.errors = this.commonService.transformServerError(err.error.errors, err);
    });
    return result;
  }

  async login(model: ILoginRequest) {
    if (model.phone.substr(0,1) !== '+' ) {
      model.phone = `+${model.phone}`
    }
    let result: IGenericCommonResponse<ILoginResponse> = {};
    await this.apiService.login(model).then(val => {
      result.data = val
      this.storageService.setCredentialToStorage({field1: model.phone, field2: model.password});
      this.storageService.setTokenToStorage(result.data.response.token);
      this.ds.token = result.data.response.token;
    }).catch(err => {
      result.error = this.commonService.transformServerError(err.error.errors || err.error || [err.error.message], err);
    });
    return result;
  }

  async forgot(model: IForgotRequest) {
    let result: IGenericCommonResponse<IForgotResponse> = {};
    await this.apiService.forgot(model).then(val => {
      result.data = val
    }).catch(err => {
      if (err.error.message) {
        result.error = this.commonService.transformServerError([err.error.message]);  
      } else {
        result.error = this.commonService.transformServerError(err.error.errors || err.error || [err.error.message]); 
      }
    });
    return result;
  }

  isAvailBio() {
    return this.faio.isAvailable().then(val => {
      return val =='biometric'
    }).catch(err => {
      return false
    })
  }

}
