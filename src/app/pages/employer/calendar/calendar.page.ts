import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ModalController, PopoverController } from '@ionic/angular';
import { DayConfig, CalendarComponent, CalendarDay, CalendarOptions } from 'ion2-calendar';
import * as moment from 'moment';
import { Moment } from 'moment';
import { AddEventComponent } from 'src/app/components/add-event/add-event.component';
import { EmployerInterviewItemActionsComponent } from 'src/app/components/employer-interview-item-actions/employer-interview-item-actions.component';
import { ICalendarResponse, IEvent } from 'src/app/interfaces/events.interface';
import { IInterview } from 'src/app/interfaces/interview.interfaces';
import { IOffer } from 'src/app/interfaces/offer.interfaces';
import { ApiService } from 'src/app/services/api.service';
import { CalendarService } from 'src/app/services/calendar.service';
import { ProfileService } from 'src/app/services/profile.service';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.page.html',
  styleUrls: ['./calendar.page.scss'],
})
export class CalendarPage implements OnInit {

  sortASC = true;
  currentFullDate: string;
  isSearchOpened = false;
  date = moment();
  type: 'string';
  info: Array<IInterview & IEvent>;
  form = new FormGroup({
    search: new FormControl('')
  })

  @ViewChild('calendar') calendar: CalendarComponent;

  public options: CalendarOptions = {
    from: moment('2021-01-01').toDate(),
    to: moment().add(1, 'year').toDate(),
    daysConfig: new Array<DayConfig>()
  };

  constructor(
    private popoverController: PopoverController,
    private modalController: ModalController,
    private calendarService: CalendarService,
    private apiServices: ApiService,
    private profileService: ProfileService
  ) { }

  ngOnInit() {
  }

  ionViewWillEnter() {
    setTimeout(val => {
      this.loadEventCount()
      this.calendar.monthChange.subscribe(val => {
        setTimeout(val => {
          this.loadEventCount()
        })
      })
      this.initCalendar()
    }, 0)
    setTimeout(val => {
      this.initCalendar();
    }, 0)
  }

  initCalendar() {
    this.firstData()
  }

  getVisibleRange(): RangeDaysModel {
    const days = (this.calendar.monthOpt.days as CalendarDay[]);
    const start = moment(days[0].time);
    const end = moment(days[days.length - 1].time);
    return {
      start: start,
      end: end
    }
  }

  async firstData() {
    const range = this.getVisibleRange()
    const start = range.start.format('YYYY-MM-DD');
    const end = range.end.format('YYYY-MM-DD');
    const result: ICalendarResponse = {
      data: {
        events: [],
        interviews: []
      }
    }

    const resp = await this.apiServices.getCalendarEventsByRange(start, end, '').then(val => {
      val.data.interviews.forEach(v => {
        v.candidate.image = this.profileService.convertImagePath(v.candidate.image, 'img');
        v.company.image = this.profileService.convertImagePath(v.company.image, 'img')
      });
      return val;
    }).catch(err => {
      return result
    })

    this.info = this.calendarService.buildCalendarEventList(resp.data);
  }

  async onChange($event) {
    const search: string = this.isSearchOpened ? this.form.get('search').value : '';
    this.currentFullDate = ($event as Moment).format('dddd, MMMM D');
    const date = ($event as Moment).format('YYYY-MM-DD');
    const response = await this.calendarService.loadCalendarEvents(date, search);
    this.info = this.calendarService.buildCalendarEventList(response.data);
  }

  sort() {
    this.sortASC = !this.sortASC;
    this.info = this.calendarService.sortCalendarEventList(<(IInterview & IEvent & IOffer)[]>this.info, this.sortASC);
  }

  async interviewItemActions(ev: any) {
    const popover = await this.popoverController.create({
      component: EmployerInterviewItemActionsComponent,
      // cssClass: 'info-popover',
      event: ev,
      translucent: false,
      mode: 'md'
    });
    await popover.present();
  }

  async addEvent() {
    const modal = await this.modalController.create({
      component: AddEventComponent,
      cssClass: 'fullpage-modal',
    });
    modal.onDidDismiss().then(val => {
      this.updateInterviewList();
    })
    return await modal.present();
  }

  openSearch() {
    this.isSearchOpened = true;
  }

  async searchChange(event) {
    const text = event.detail.value;
    const response = await this.calendarService.loadCalendarEvents(this.date.format('YYYY-MM-DD'), text);
    this.info = this.calendarService.buildCalendarEventList(response.data);
  }

  closeSearch() {
    this.isSearchOpened = false;
    this.onChange(this.date)
  }

  async loadEventCount() {
    this.calendar.monthOpt.days[0] as CalendarDay
    const start = moment((this.calendar.monthOpt.days[0] as CalendarDay).time).format('YYYY-MM-DD');
    const end = moment((this.calendar.monthOpt.days[this.calendar.monthOpt.days.length - 1] as CalendarDay).time).format('YYYY-MM-DD');
    const interviewCount = await this.calendarService.loadEventDatesArrayByRange(start, end);
    interviewCount.forEach(val => {
      this.options.daysConfig.push({
        date: moment(moment(val, 'YYYY-MM-DD')).toDate(),
        subTitle: '*',
        cssClass: 'interview-count'
      });
    });
    this.options = {
      ...this.options,
      ...{
        daysConfig: this.options.daysConfig
      }
    };
  }

  async updateInterviewList() {
    await this.loadEventCount();
    this.onChange(this.date)
  }
}

export class RangeDaysModel{
  public start: Moment;
  public end: Moment;
}