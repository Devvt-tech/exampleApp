import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, ResolveData, RouterStateSnapshot } from '@angular/router';
import * as moment from 'moment';
import { Observable } from 'rxjs';
import { IChat, IChatListResponse, ICreateMessageRequest, IGetMessagesResponse, IMessage } from '../interfaces/messages.interfaces';
import { ApiService } from './api.service';
import { CommonService } from './common.service';
import { DataService } from './data.service';
import { ProfileService } from './profile.service';
import { ToastService } from './toast.service';

@Injectable({
  providedIn: 'root'
})
export class MessagesService implements Resolve<IChat[]>{

  constructor(
    private apiService: ApiService,
    private commonService: CommonService,
    private toastService: ToastService,
    private profileService: ProfileService,
    private ds: DataService,
  ) { }
  
  async resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<IChat[]> {
    const list = await this.loadChatList();
    this.getAllUnreadMessageNumber();
    return list;
  }

  loadChatList() {
    return this.apiService.loadChatList().then(val => {
      val.data.items.forEach(val => {
        val.icon = this.profileService.convertImagePath(val.icon, 'img');
        val.last_message.prittyDate = moment(val.last_message.created_at).calendar();
      });;
      return val.data.items;
    }).catch(err => {
      return new Array<IChat>();
    })
  }

  createMessage(model: ICreateMessageRequest) {
    return this.apiService.createMessage(model).then(val => {
      if (val.errors?.length) {
        this.toastService.showToast(this.commonService.transformServerErrorV2(val.errors));
        return 0;
      } else {
        return val.data.chat_id;
      }
    }).catch(err => {
      err.error.errors && this.toastService.showToast(this.commonService.transformServerErrorV2(err.error.errors));
      return 0;
    })
  }

  loadMessageList(chatId: number) {
    const result: IGetMessagesResponse = {}
    return this.apiService.getMessageByChatId(chatId).then(val => {
      val.data.messages.forEach(val => {
        val.icon = this.profileService.convertImagePath(val.icon, 'img');
        const mom = moment(val.created_at);
        const iscurrentDate = mom.isSame(new Date(), "day");
        val.prittyDate = iscurrentDate ? 'Today' : moment(val.created_at).format('ll');
      });
      val.data.chat.icon = this.profileService.convertImagePath(val.data.chat.icon, 'img');
      return val.data;
    }).catch(err => {
      return result;
    })
  }

  markAsRead(ids: number[]) {
    this.apiService.markAsRead(ids).then(val => {
    }).catch(err => {
    })
  }

  getAllUnreadMessageNumber() {
    return this.apiService.getAllUnreadMessageNumber().then(val => {
      this.ds.unreadMessagesNumber.next(val.data.total);
      return val.data.total;
    }).catch(err => {
      this.ds.unreadMessagesNumber.next(0);
      return 0;
    })
  }

  removeMessage(messageId: number) {
    return this.apiService.removeMessage(messageId).then(val => {
      if (val.errors?.length) {
        this.toastService.showToast(this.commonService.transformServerErrorV2(val.errors));
        return false;
      } else {
        return val.data.is_deleted
      }
    }).catch(err => {
      err.error.errors && this.toastService.showToast(this.commonService.transformServerErrorV2(err.error.errors));
      return false;
    })
  }

}
