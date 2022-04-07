import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage-angular';
import { ICredentials } from '../interfaces/auth.interface';
import { INotification } from '../interfaces/common.interface';

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  private _storage: Storage | null = null;

  constructor(
    private storage: Storage
  ) {
    this.init()
  }

  async init() {
    const storage = await this.storage.create();
    this._storage = storage;
  }

  setTokenToStorage(val: string) {
    this.storage.set('token', val);
  }

  async getTokenFromStorage() {
    return await this.storage.get('token');
  }

  async removeTokenFromStorage() {
    return this.storage.remove('token');
  }

  setCredentialToStorage(credentials: ICredentials) {
    this.storage.set('field1', credentials.field1);
    this.storage.set('field2', credentials.field2);
  }

  async getCredentialFromStorage() {
    const res: ICredentials = {
      field1: await this.storage.get('field1'),
      field2: await this.storage.get('field2')
    }
    return res;
  }

  async addPushToStorage(data: INotification) {
    let list = await this.getPushFromStorage();
    if (!list) {
      list = []
    }
    list.push(data)
    this.storage.set('pushs', list)
  }

  async getPushFromStorage() {
    const data: INotification[] = await this.storage.get('pushs');
    return data;
  }

}
