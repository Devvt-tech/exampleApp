import { Injectable } from '@angular/core';
import { ICity } from '../interfaces/location.interface';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class LocationService {

  constructor(
    private apiService: ApiService
  ) { }

  getCities() {
    return this.apiService.getCities().then(val => {
      return val;
    }).catch(error => {
      return Array<ICity>();
    })
  }

  setLocation(cityId: number, areas: number[]) {
    return this.apiService.setLocation(cityId, areas).then(val => {
      return val;
    }).catch(error => {
      return false
    })
  }

  getAreas(id: number) {
    return this.apiService.getAreas(id).then(val => {
      return val;
    }).catch(error => {
      return Array<ICity>();
    })
  }
}
