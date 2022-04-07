import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { IonContent, PopoverController } from '@ionic/angular';
import { ChatMenuComponent } from 'src/app/components/chat-menu/chat-menu.component';
import { IChat, ICreateMessageRequest, IMessage } from 'src/app/interfaces/messages.interfaces';
import { MessagesService } from 'src/app/services/messages.service';
import { ToastService } from 'src/app/services/toast.service';
import { Clipboard } from '@awesome-cordova-plugins/clipboard/ngx';
import { INotification } from 'src/app/interfaces/common.interface';
import * as moment from 'moment';
import { PushService } from 'src/app/services/push.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.page.html',
  styleUrls: ['./chat.page.scss'],
})
export class ChatPage implements OnInit {

  messages: IMessage[];
  chat: IChat;
  recipId: number;
  form = new FormGroup({
    text: new FormControl('', [Validators.required])
  })
  @ViewChild('scrollContainer') content: IonContent;
  scrollDepthTriggered: boolean;
  markAsReadScroll: boolean;
  timeoutHandler: any;
  count: number = 0;

  get message() {
    return this.form.get('text').value;
  }

  constructor(
    private popoverController: PopoverController,
    private actRoute: ActivatedRoute,
    private messageService: MessagesService,
    private toastService: ToastService,
    private clipboard: Clipboard,
    private pushService: PushService,
    private router: Router
  ) {
    actRoute.data.subscribe(data => {
      this.messages = data.messagesInfo.messages;
      this.chat = data.messagesInfo.chat;
      this.recipId = data.messagesInfo.recipient_id;
    });
  }

  ngOnInit() {
  }

  ionViewWillEnter() {
    setTimeout(val => {
      this.markAsReadScroll = true;
      this.markAsRead();
    }, 2000)
  }

  async chatMenuPopover(ev: any) {
    const popover = await this.popoverController.create({
      component: ChatMenuComponent,
      // cssClass: 'info-popover',
      event: ev,
      translucent: false,
      mode: 'md'
    });
    await popover.present();

    const { role } = await popover.onDidDismiss();
    console.log('onDidDismiss resolved with role', role);
  }


  onSendClick() {
    const model: ICreateMessageRequest = {
      message: this.message,
      receiver_id: this.recipId
    }
    this.messageService.createMessage(model).then(async val => {
      if (val > 0) {

        const push: INotification = {
          body: this.message,
          candidate_id: this.recipId,
          company_id: this.recipId,
          sent_time: moment().unix() * 1000,
          title: 'A new message'
        };
        this.pushService.addPushToDatabase(push);



        this.messages = (await this.messageService.loadMessageList(val)).messages;
        this.form.get('text').setValue('');
        setTimeout(val => {
          this.content.scrollToBottom();
        })
      }
    })
  }

  async logScrolling($event) {
    if (this.scrollDepthTriggered) {
      return;
    }
    if ($event.target.localName != "ion-content") {
      return;
    }

    const scrollElement = await $event.target.getScrollElement();
    const scrollHeight = scrollElement.scrollHeight - scrollElement.clientHeight;

    const currentScrollDepth = $event.detail.scrollTop;
    const targetPercent = 80;
    let triggerDepth = ((scrollHeight / 100) * targetPercent);

    if (currentScrollDepth > triggerDepth) {
      this.scrollDepthTriggered = true;
      // setTimeout(val => {
      //   this.markAsReadScroll = true;
      //   this.markAsRead();
      // }, 5000)
    }
  }

  markAsRead() {
    const res: number[] = [];
    this.messages.forEach(mes => {
      mes.is_unread && !mes.is_my && res.push(mes.id);
    })
    res && res.length > 0 && this.messageService.markAsRead(res);
  }

  selectMessage(mess: IMessage) {
    this.selectedClear();
    mess.isSelected = true;
  }

  selectedClear() {  
    this.messages.forEach((m) => {
      m.isSelected = false;
    })
  }
  
  async removeMessage(mess: IMessage) {
    console.log('removeMessage');
    const res = await this.messageService.removeMessage(mess.id);
    if (res) {
      this.toastService.showSuccessToast();
      this.messages = this.messages.filter(m => {
        return m.id !== mess.id;
      })
    }
  }

  copyMessage(event, mess: IMessage) {
    event.stopPropagation();
    this.clipboard.copy(mess.text).then(v => {
      this.selectedClear()
    });
  }

  toProfile(id: number) {
    const route = 'profile'; //this.ds.isCompany ? '/company-profile' : '/profile'
    this.router.navigate([`${route}/${id}`])
  }

  onClickMessage(mess: IMessage) {
    !mess.is_my && this.toProfile(this.recipId)
  }

}
