import { Injectable } from '@angular/core';
import { collection, collectionData, deleteDoc, doc, Firestore, setDoc, where } from '@angular/fire/firestore';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { INotification } from '../interfaces/common.interface';
import { DataService } from './data.service';
import { ProfileService } from './profile.service';
import { StorageService } from './storage.service';

@Injectable({
  providedIn: 'root'
})
export class PushService implements Resolve<INotification[]> {

  constructor(
    private storageService: StorageService,
    private readonly firestore: Firestore,
    private profileService: ProfileService,
    private ds: DataService
  ) { }
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<INotification[]> {
    return this.getFromStorage();
  }

  addToStorage(data: INotification) {
    this.storageService.addPushToStorage(data);
  }

  getFromStorage() {
    return this.storageService.getPushFromStorage()
  }

  getPushList() {
    const id = this.ds.user$.value.id;
    const contactsCollection = collection(this.firestore, 'push');
    return collectionData(contactsCollection, { idField: 'id' })
      .pipe(
        map(val => {
          const pushes = val as INotification[];
          return pushes.filter(push => {
            return push.candidate_id === id || push.company_id === id
          })
        })
      ).pipe(
        map(val => val.map(async v => {
          const user = await this.profileService.getProfileById(this.ds.isCompany ? v.candidate_id : v.company_id);
          return {name: user.name, img: user.image, ...v} as INotification
        }))
      )
  }

  addPushToDatabase(push: INotification): Promise<void> {
    const document = doc(collection(this.firestore, 'push'));
    return setDoc(document, push);
  }

  deletePushFromDatabase(id: string): Promise<void> {
    const document = doc(this.firestore, 'push', id);
    return deleteDoc(document);
  }


}
