import { Component, OnInit } from '@angular/core';
import { Firestore } from '@angular/fire/firestore';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { INotification } from 'src/app/interfaces/common.interface';
import { DataService } from 'src/app/services/data.service';
import { ProfileService } from 'src/app/services/profile.service';
import { PushService } from 'src/app/services/push.service';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.page.html',
  styleUrls: ['./notifications.page.scss'],
})
export class NotificationsPage implements OnInit {

  headerHideOnScroll = false;
  headerFixOnScroll = false;
  pushes: INotification[];
  pushes$: Observable<Promise<INotification>[]>;

  constructor(
    private actRoute: ActivatedRoute,
    private profileService: ProfileService,
    private pushService: PushService,
    private readonly firestore: Firestore,
    private router: Router,
    private ds: DataService
  ) {
    actRoute.data.subscribe(val => {
      //this.pushes = val.pushes;
      //this.buildPushList(this.pushes);
    })
  }

  ngOnInit() {
    this.pushes$ = this.pushService.getPushList();
  }

  buildPushList(pushes: INotification[]) {
    pushes.forEach(async push => {
      if (push.candidate_id) {
        const user = await this.profileService.getProfileById(push.candidate_id);
        push.name = user.name;
        push.img = user.image
        console.log(user.name);
        
      }
    })
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

  
  ionDrag() {
    
  }

  async ionSwipe(push: Promise<INotification>) {
    const id = (await push).id;
    this.pushService.deletePushFromDatabase(id)
  }

  async toProfile(push: Promise<INotification>) {
    let route: string;
    let id: number;

    if (this.ds.isCompany) {
      route = '/company-profile';
      id = (await push).candidate_id;
    } else {
      route = '/profile';
      id = (await push).company_id;
    }
    this.router.navigate([`${route}/${id}`])
  }

}
