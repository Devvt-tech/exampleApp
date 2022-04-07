import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { IFaqQuestion } from '../interfaces/faq.interfaces';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class FaqService implements Resolve<IFaqQuestion[]> {

  constructor(
    private apiService: ApiService
  ) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): IFaqQuestion[] | Observable<IFaqQuestion[]> | Promise<IFaqQuestion[]> {
    return this.loadFAQ()
  }

  loadFAQ() {
    return this.apiService.loadFAQ().then(questions => {
      return questions
    }).catch(err => {
      return new Array<IFaqQuestion>()
    })
  }
}
