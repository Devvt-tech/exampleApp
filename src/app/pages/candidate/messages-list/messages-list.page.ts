import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MenuController } from '@ionic/angular';
import * as moment from 'moment';
import { IChat } from 'src/app/interfaces/messages.interfaces';
import { CommonService } from 'src/app/services/common.service';
import { ProfileService } from 'src/app/services/profile.service';

@Component({
  selector: 'app-messages-list',
  templateUrl: './messages-list.page.html',
  styleUrls: ['./messages-list.page.scss'],
})
export class MessagesListPage implements OnInit {
  
  headerHideOnScroll = false;
  headerFixOnScroll = false;
  isSearchOpened = false;
  chats: IChat[];

  constructor(
    private menuCtrl: MenuController,
    private actRouter: ActivatedRoute,
  ) {
    actRouter.data.subscribe(val => {
      this.chats = val.chatList;
    })
  }

  ngOnInit() {
  }

  ionViewWillLeave() {
    this.menuCtrl.close();
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

  openSearch() {
    this.isSearchOpened = true;
  }

  closeSearch() {
    this.isSearchOpened = false;
  }

}
