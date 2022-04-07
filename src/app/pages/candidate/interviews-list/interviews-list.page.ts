import { Component, HostListener, Input, OnInit, ViewChild, ViewChildren } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { IonContent, IonInfiniteScroll, IonSegment, PopoverController } from '@ionic/angular';
import { CalendarComponent, CalendarDay, CalendarOptions, DayConfig } from 'ion2-calendar';
import * as moment from 'moment';
import { Moment } from 'moment';
import { combineLatest, forkJoin, pipe } from 'rxjs';
import { map, reduce } from 'rxjs/operators';
import { InterviewItemActionsComponent } from 'src/app/components/interview-item-actions/interview-item-actions.component';
import { IEvent } from 'src/app/interfaces/events.interface';
import { IInterview } from 'src/app/interfaces/interview.interfaces';
import { IOffer } from 'src/app/interfaces/offer.interfaces';
import { CalendarService } from 'src/app/services/calendar.service';
import { LoadingService } from 'src/app/services/loading.service';

@Component({
  selector: 'app-interviews-list',
  templateUrl: './interviews-list.page.html',
  styleUrls: ['./interviews-list.page.scss'],
})
export class InterviewsListPage implements OnInit {

  sortASC = true;
  isSearchOpened = false;
  date: Moment = moment();
  type: 'string';
  form = new FormGroup({
    search: new FormControl('')
  })

  currentFullDate: string;
  info: Array<IInterview & IEvent>;
  @ViewChild(IonInfiniteScroll) infiniteScroll: IonInfiniteScroll;
  @ViewChild(IonContent, {static: false}) private content: IonContent;
  @ViewChild(IonSegment, {static: false}) private segment: IonSegment;
  hasScrollbar: boolean;
  startDate: string;
  endDate: string;
  prittyStartDate: string;
  prittyEndDate: string;
  emptyListForScroll = new Array<number>();
  segmentValue: string;

  constructor(
    public popoverController: PopoverController,
    private calendarService: CalendarService,
    private loadingService: LoadingService
  ) { }

  ngOnInit() {
  }
  
  async ionViewWillEnter() {
    setTimeout(v => {
      this.segment.value = 'future';
    })
  }

  segmentChanged(event) {
    this.segmentValue = event.detail.value;
    switch (this.segmentValue) {
      case 'future' : this.showFuture(); break;
      case 'past' : this.showPast(); break;
      default : this.showFuture();break;
    }
  }

  async showFuture() {
    this.startDate = moment().format('YYYY-MM-DD');
    this.endDate = moment().add(30, 'day').format('YYYY-MM-DD');
    this.prittyStartDate = moment(this.startDate, 'YYYY-MM-DD').format('MM-DD-YYYY');
    this.prittyEndDate = moment(this.endDate, 'YYYY-MM-DD').format('MM-DD-YYYY');
    this.info = <(IInterview & IEvent)[]>await this.calendarService.interviewListForPeriod(this.startDate, this.endDate);
  }

  async showPast() {
    this.startDate = moment().add(-30, 'day').format('YYYY-MM-DD');
    this.endDate = moment().add(-1, 'day').format('YYYY-MM-DD');
    this.prittyStartDate = moment(this.startDate, 'YYYY-MM-DD').format('MM-DD-YYYY');
    this.prittyEndDate = moment(this.endDate, 'YYYY-MM-DD').format('MM-DD-YYYY');
    this.info = <(IInterview & IEvent)[]>await this.calendarService.interviewListForPeriod(this.startDate, this.endDate);
  }

  sort() {
    this.sortASC = !this.sortASC;
    this.info =  <Array<IInterview & IEvent>>this.calendarService.sortCalendarEventList(<Array<IInterview & IEvent & IOffer>>this.info, this.sortASC);
  }

  async interviewItemActions(ev: any) {
    const popover = await this.popoverController.create({
      component: InterviewItemActionsComponent,
      // cssClass: 'info-popover',
      event: ev,
      translucent: false,
      mode: 'md'
    });
    await popover.present();
  }

  openSearch() {
    this.isSearchOpened = true;
  }

  closeSearch() {
    this.isSearchOpened = false;
    this.onChange(this.date);
  }

  async onChange($event) {
  }

  async searchChange($event) {
    const text = $event.detail.value;
    if (text) {
      this.info = (await this.calendarService.filterInterview(text, this.startDate, this.endDate) as Array<IInterview & IEvent>);
    } else {
      switch (this.segmentValue) {
        case 'future' : this.showFuture(); break;
        case 'past' : this.showPast(); break;
        default : this.showFuture();break;
      }
    }
  }



  async loadMoreClick() {
    switch(this.segmentValue) {
      case 'past' : {
        this.startDate = moment(this.startDate, 'YYYY-MM-DD').add(-30, 'day').format('YYYY-MM-DD');
        this.prittyStartDate = moment(this.startDate, 'YYYY-MM-DD').format('MM-DD-YYYY');
        break;}
      case 'future' : {
        this.endDate = moment(this.endDate, 'YYYY-MM-DD').add(30, 'day').format('YYYY-MM-DD');
        this.prittyEndDate = moment(this.endDate, 'YYYY-MM-DD').format('MM-DD-YYYY');
        break;}
      default: break;
    }
    this.loadingService.showLoader();
    this.info = <(IInterview & IEvent)[]>await this.calendarService.interviewListForPeriod(this.startDate, this.endDate);
    this.loadingService.hideLoader();
  }

  async doRefresh(event) {
    this.startDate = moment().format('YYYY-MM-DD');
    this.endDate = moment().add(30, 'day').format('YYYY-MM-DD');
    this.prittyStartDate = moment(this.startDate, 'YYYY-MM-DD').format('MM-DD-YYYY');
    this.prittyEndDate = moment(this.endDate, 'YYYY-MM-DD').format('MM-DD-YYYY');    
    event.target.complete();
  }

}