import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { IUser } from '../interfaces/common.interface';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  constructor() { }

  token: string;
  isCompany: boolean;
  user$ = new BehaviorSubject<IUser>(null);
  deviceToken: string;
  unreadMessagesNumber = new BehaviorSubject<number>(0);
  unreadOfferNumber = new BehaviorSubject<number>(0);
}
