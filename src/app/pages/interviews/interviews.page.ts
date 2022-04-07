import { Component, OnInit, ViewChild } from '@angular/core';
import { IonSegment } from '@ionic/angular';
import * as moment from 'moment';
import { IEvent } from 'src/app/interfaces/events.interface';
import { IInterview } from 'src/app/interfaces/interview.interfaces';
import { IOffer } from 'src/app/interfaces/offer.interfaces';
import { CalendarService } from 'src/app/services/calendar.service';
import { DataService } from 'src/app/services/data.service';
import { LoadingService } from 'src/app/services/loading.service';

@Component({
  selector: 'app-interviews',
  templateUrl: './interviews.page.html',
  styleUrls: ['./interviews.page.scss'],
})
export class InterviewsPage implements OnInit {

  @ViewChild(IonSegment, {static: false}) private segment: IonSegment;
  segmentValue: string;
  isCompany: boolean;

  startDate: string;
  endDate: string;
  prittyStartDate: string;
  prittyEndDate: string;
  info: Array<IInterview & IEvent>;
  sortASC = true;
  isPast: boolean;

  constructor(
    private ds: DataService,
    private calendarService: CalendarService,
    private loadingService: LoadingService
  ) {}

  ngOnInit() {
    this.isCompany = this.ds.isCompany;
  }

  async ionViewWillEnter() {
    setTimeout(v => {
      this.segment.value = 'pending';
    })
  }

  segmentChanged(event) {
    this.segmentValue = event.detail.value;
    switch (this.segmentValue) {
      case 'pending' : break;
      case 'confirmed' : this.showInterviews();
      default : break;
    }
  }

  async showInterviews() {
    this.startDate = moment().format('YYYY-MM-DD');
    this.endDate = moment().add(1, 'year').format('YYYY-MM-DD');
    this.prittyStartDate = moment(this.startDate, 'YYYY-MM-DD').format('MM-DD-YYYY');
    this.prittyEndDate = moment(this.endDate, 'YYYY-MM-DD').format('MM-DD-YYYY');
    this.info = <(IInterview & IEvent)[]>await this.calendarService.interviewListForPeriod(this.startDate, this.endDate);
  }

  async loadMoreClick() {
    // Not used
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

  sort() {
    this.sortASC = !this.sortASC;
    this.info =  <Array<IInterview & IEvent>>this.calendarService.sortCalendarEventList(<Array<IInterview & IEvent & IOffer>>this.info, this.sortASC);
  }

  async showPast() {
    this.isPast = true;
    this.info = <(IInterview & IEvent)[]>await this.calendarService.interviewHistory();
  }

  async showConfirmed() {
    this.isPast = false;
    this.showInterviews();
  }

}
