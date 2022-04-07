import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { IAvailabilityResponse, IEmploymentTypes, IProfile, IUser } from '../interfaces/common.interface';
import { ApiService } from './api.service';
import { CertificatesService } from './certificates.service';
import { CommonService } from './common.service';
import { DataService } from './data.service';
import { StorageService } from './storage.service';

@Injectable({
  providedIn: 'root'
})
export class ProfileService implements Resolve<IUser> {

  private baseUrl = environment.baseUrl;
  availabilities: IAvailabilityResponse;

  constructor(
    private apiService: ApiService,
    private ds: DataService,
    private storageService: StorageService,
    private certificatesService: CertificatesService,
    private commonService: CommonService
  ) { }

  async resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<IUser> {
    this.ds.token = this.ds.token || await this.storageService.getTokenFromStorage()
    const id = Number(route.params.id);
    const user$ = !!id ? this.getProfileById(id) : this.getProfile();
    this.getUnreadOfferNumber();
    return user$.then(val => {
      return val;
    })
  }

  getProfile() {
    const url = this.ds.isCompany ? 'profileCompany' : 'profile';
    let result: IUser;
    return this.apiService.getUser(url).then(val => {
      this.ds.isCompany = val.role_id === 2;
      this.convertUserInfo(val);
      this.ds.user$.next(val);
      
      return val
    }).catch(err => {
      return result
    })
  }

  getProfileById(id: number) {
    let result: IUser;
    return this.apiService.getUserById(id)
    .then(user => {
      this.convertUserInfo(user);
      return user
    })
    .catch(err => {
      return result
    })
  }

  convertUserInfo(user: IUser) {
    if (user.image) {
      user.image = this.convertImagePath(user.image, 'img');
    }
    user.certificates.forEach(cert => {
      cert.img = cert.img as string;
      const split = cert.img.split('.');
      const ext = split[split.length - 1];
      if (['jpg', 'jpeg', 'png'].includes(ext.toLocaleLowerCase())) {
        cert.img = this.convertImagePath(String(cert.img), 'certificate');
      } else {
        cert.img = this.certificatesService.checkFileType(cert.img as string, true);
      }
    })
  }

  convertImagePath(img: string, folder: string) {
    if (img && !img.includes(this.baseUrl)) {
      return `${this.baseUrl}public/storage/${folder}/${img.split('/')[2]}`;
    } else {
      return img
    }
  }

  addToSaved(candidate: number, company: number) {
    return this.apiService.addToSaved(candidate, company)
    .then(res => {
      return res.message;
    })
    .catch(err => {
      return {}
    })
  }

  removeFromSaved(candidate: number, company: number) {
    return this.apiService.removeFromSaved(candidate, company)
    .then(res => {
      return res.message
    })
    .catch(err => {
      return ''
    })
  }

  getReadyToWorkArray(types: IEmploymentTypes) {
    const result: number[] = [];
    types?.is_full_time === 1 && result.push(1);
    types?.is_part_time === 1 && result.push(2);
    types?.is_on_demand === 1 && result.push(3);
    return result;
  }

  getCandidatePercent = (profile: IProfile) => {
    let result = 0;
    const availability = (profile.user.availability as any).length === 0 ? null : profile.user.availability; //TODO
    const empl = !Array.isArray(profile.user.types_employment) ? this.getReadyToWorkArray(profile.user.types_employment) : profile.user.types_employment;
    result = profile.user.image ? ++result : result;
    result = profile.user.name ? ++result : result;
    result = empl?.length > 0 ? ++result : result;
    result = profile.user.city || profile.user.areas?.length > 0 ? ++result : result;
    result = profile.user.positions?.length > 0 && profile.user.positions[0].name ? ++result : result;
    result = profile.user.interesting_jobs?.length > 0 ? ++result : result;
    result = availability ? ++result : result;
    result = profile.user.covid !== null ? ++result : result;
    
    // result = profile.quizzes?.length > 0 ? ++result : result;
    // result = profile.user.resumes.length > 0 ? ++result : result;
    // result = profile.user.certificates?.length > 0 ? ++result : result;
    // result = profile.user.facebook || profile.user.instagram || profile.user.twitter ? ++result : result;
    // result = profile.user.interesting_jobs?.length > 0 ? ++result : result;
    
    return Math.round(result * 100 / 8);
  }

  changeOnDemand = async (value: number) => {
    let result: any = {};
    await this.apiService.changeOnDemand(value).then(val => {
      if (val.errors) {
        result.error = this.commonService.transformServerErrorV2(val.errors);
      } else {
        result.data = val.data.is_updated;
      }
    }).catch(err => {
      result.errors = this.commonService.transformServerErrorV2(err.error.errors, err);
    })
    return result;
  }

  getUnreadOfferNumber() {
    return this.apiService.getUnreadOfferNumber().then(val => {
      this.ds.unreadOfferNumber.next(val);
      return val;
    }).catch(err => {
      this.ds.unreadMessagesNumber.next(0);
      return 0;
    })
  }
}
