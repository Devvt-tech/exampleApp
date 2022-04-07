import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { DataService } from './data.service';
import { ProfileService } from './profile.service';
import { StorageService } from './storage.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardService implements CanActivate {

  constructor(
    private ds: DataService,
    private storageService: StorageService,
    private profileService: ProfileService
  ) { }

  async canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean> {
    if (!this.ds.token) {
      this.ds.token = await this.storageService.getTokenFromStorage();
    };
    !this.ds.user$.value && await this.profileService.getProfile();
    if (this.ds.token) {
      return true;
    } else {
      return !!this.ds.token;
    }
  }
}
