import { Injectable } from '@angular/core';
import { ICreateVacancyRequest, IShortVacancy, IVacancy } from '../interfaces/vacancies.interfaces';
import { ApiService } from './api.service';
import { CommonService } from './common.service';

@Injectable({
  providedIn: 'root'
})
export class VacanciesService {

  constructor(
    private apiService: ApiService,
    private commonService: CommonService
  ) { }

  createOrUpdateVacancy(request: ICreateVacancyRequest) {
    const result: IVacancy = null;
    return this.apiService.createOrUpdateVacancy(request).then(val => {
      return val;
    }).catch(err => {
      return result
    })
  }

  getVacancies() {
    const result = new Array<IVacancy>() ;
    return this.apiService.getVacancies().then(vacs => {
      vacs.forEach(val => {
        val.statusColor = this.commonService.getStatusColor(val.status)
      });
      return vacs;
    }).catch(err => {
      return result
    })
  }

  deleteVacancy(id: number) {
    return this.apiService.deleteVacancy(id).then(vacs => {
      return true;
    }).catch(err => {
      return false;
    })
  }

  archiveVacancy(id: number) {
    return this.apiService.archiveVacancy(id).then(vacs => {
      return true;
    }).catch(err => {
      return false;
    })
  }

  activeVacancy(id: number) {
    return this.apiService.activeVacancy(id).then(vacs => {
      return true;
    }).catch(err => {
      return false;
    })
  }

  numToEmploym(vacancy: IVacancy) {
    let array: string[] = [];
    if (vacancy.employment?.toString().includes('1')) {
      array.push("Full time");
    }
    if (vacancy.employment?.toString().includes('2')) {
      array.push("Part time");
    }
    if (vacancy.employment?.toString().includes('3')) {
      array.push("On demand");
    }
    return array.toString();
  }




}
