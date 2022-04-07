import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { IAvailabilityResponse, IUser } from 'src/app/interfaces/common.interface';
import { AvailabilityService } from 'src/app/services/availability.service';
import { DAYS_ARRAY } from 'src/constants';
import { InAppBrowser, InAppBrowserOptions } from '@ionic-native/in-app-browser/ngx';
import { ProfileService } from 'src/app/services/profile.service';
import { DataService } from 'src/app/services/data.service';
import { CommonService } from 'src/app/services/common.service';
import { IAddress } from 'src/app/interfaces/address.intertfaces';

@Component({
  selector: 'app-company-profile',
  templateUrl: './company-profile.page.html',
  styleUrls: ['./company-profile.page.scss'],
})
export class CompanyProfilePage implements OnInit {

  headerHideOnScroll = false;
  headerFixOnScroll = false;
  avatar: string;
  user: IUser;
  daysArray = DAYS_ARRAY;
  availabilities: IAvailabilityResponse;
  private inAppBrowserOptions: InAppBrowserOptions= {
    zoom: 'no',
    hideurlbar: 'yes',
    hidenavigationbuttons: 'yes',
    location: 'no'
  }
  rating: number;
  addresses: IAddress[];

  constructor(
    private actRoute: ActivatedRoute,
    public modalController: ModalController,
    private availabilityService: AvailabilityService,
    private iab: InAppBrowser,
    private profileService: ProfileService,
    public ds: DataService,
    private commonService: CommonService,
  ) {
    actRoute.data.subscribe(data => {
      this.user = data.user as IUser;
      this.availabilities = data.availabilities as IAvailabilityResponse;
      this.rating = data.rating;
      this.addresses = data.addresses;
    });
  }

  ngOnInit() {
  }

  onScroll(event) {   
    if (event.detail.scrollTop > 0) {      
      this.headerHideOnScroll = true;
      this.headerFixOnScroll = false;
      
      if (event.detail.deltaY <= 0 && event.detail.scrollTop > 100) {
        this.headerHideOnScroll = false;
        this.headerFixOnScroll = true;
      }
      
    } else {
      this.headerHideOnScroll = false;
      this.headerFixOnScroll = false;
    }
  }

  async updateAvailability() {
    this.user = await this.profileService.getProfile();
    this.ds.user$.next(this.user);
  }

  facebookClick() {
    this.iab.create(this.user.facebook, '_system', this.inAppBrowserOptions);
  }

  instagramClick() {
    this.iab.create(this.user.instagram, '_system', this.inAppBrowserOptions);
  }

  twitterClick() {
    this.iab.create(this.user.twitter, '_system', this.inAppBrowserOptions);
  }

  onImageClick(url: string) {
    this.commonService.imageFullScreen(url)
  }

}
