import { Injectable } from '@angular/core';
import * as moment from 'moment';
import { ICalendarInfo, ICalendarResponse, ICreateEventRequest, IEvent, IEventDatesByRange, IInterviewCountOfDate } from '../interfaces/events.interface';
import { IInterview } from '../interfaces/interview.interfaces';
import { IOffer } from '../interfaces/offer.interfaces';
import { ApiService } from './api.service';
import { DataService } from './data.service';
import { ProfileService } from './profile.service';
import { CommonService } from './common.service';
import { IGenericCommonResponse } from '../interfaces/common.interface';

@Injectable({
  providedIn: 'root'
})
export class CalendarService {

  constructor(
    private apiServices: ApiService,
    private ds: DataService,
    private profileService: ProfileService,
    private commonService: CommonService
  ) { }

  async loadCalendarEvents(date: string, search: string) {
    const result: ICalendarResponse = {
      data: {
        events: [],
        interviews: []
      }
    }
    return this.apiServices.getCalendarEvents(date, search).then(val => {
      val.data.interviews.forEach(v => {
        v.candidate.image = this.profileService.convertImagePath(v.candidate.image, 'img');
        v.company.image = this.profileService.convertImagePath(v.company.image, 'img')
      });
      return val;
    }).catch(err => {
      return result
    })
  }

  async createCalendarEvents(date: ICreateEventRequest) {
    let result: IGenericCommonResponse<IEvent> = {};
    await this.apiServices.createCalendarEvent(date).then(val => {
      if (val.errors) {
        result.error = this.commonService.transformServerErrorV2(val.errors);
      } else {
        result.data = val.data;
      }
    }).catch(err => {
      result.errors = this.commonService.transformServerErrorV2(err.error.errors, err);
    })
    return result;
  }

  async updateCalendarEvents(request: ICreateEventRequest, id: number) {
    let result: IGenericCommonResponse<IEvent> = {};
    await this.apiServices.updateCalendarEvent(request, id).then(val => {
      if (val.errors) {
        result.error = this.commonService.transformServerErrorV2(val.errors);
      } else {
        result.data = val.data;
      }
    }).catch(err => {
      result.errors = this.commonService.transformServerErrorV2(err.error.errors, err);
    })
    return result;
  }

  loadInterviewsByDate(date: string, search: string) {
    return this.apiServices.getInterviews(date, search).then(val => {
      val.forEach(v => {
        v.from.image = this.profileService.convertImagePath(v.from.image, 'img');
        v.to.image = this.profileService.convertImagePath(v.to.image, 'img')
      })
      return val;
    }).catch(err => {
      return new Array<IOffer>();
    })
  }


  buildCalendarEventList(info: ICalendarInfo) {
    let result: any[] = [];
    if (info?.events && info.events.length > 0) {
      info.events.forEach(v => {v.isEvent = true})
      result = result.concat(info.events)
    }
    if (info?.interviews && info.interviews.length > 0) {
      result = result.concat(info.interviews);
    }
    return result;
  }

  filterInterview(text: string, start: string, end: string) {
    return this.apiServices.filterInterview(text, start, end).then(val => {
      val.data.interviews.forEach(v => {
        v.candidate.image = this.profileService.convertImagePath(v.candidate.image, 'img');
        v.company.image = this.profileService.convertImagePath(v.company.image, 'img')
      })
      return val.data.interviews
    }).catch(err => {
      return new Array<IInterview>();
    })
  }

  sortCalendarEventList(info: Array<IInterview & IEvent & IOffer>, sort: boolean) {
    info = info.sort((a, b) => {
      const aDate = moment(a.meeting_times[0].date).format('YYYY-MM-DD');
      const aTime = moment(a.meeting_times[0].from_time).format('HH:mm:ss');
      const aMoment = moment(`${aDate}T${aTime}`, 'YYYY-MM-DDTHH:mm:ss');
      const aStamp = aMoment.unix();

      const bDate = moment(b.meeting_times[0].date).format('YYYY-MM-DD');
      const bTime = moment(b.meeting_times[0].to_time).format('HH:mm:ss');
      const bMoment = moment(`${bDate}T${bTime}`, 'YYYY-MM-DDTHH:mm:ss');
      const bStamp = bMoment.unix();
      let result: number;

      if (aStamp - bStamp > 0) {
        result = sort ? 1 : -1;
      } else if (aStamp - bStamp < 0) {
        result = !sort ? 1 : -1;
      } else {
        result = 0
      }
      console.log(result);
      
      return result
    })
    return info;
  }


  loadEventDatesArrayByRange(start: string, end: string) {
    let res: string[] = [];
    return this.apiServices.getEventDatesByRange(start, end).then(val => {
      return val.data.dates;
    }).catch(err => {
      return res;
    })
  }

  interviewListForPeriod(start: string, end: string) {
    let result: IInterview[];
    return this.apiServices.interviewListForPeriod(start, end).then(val => {
      result = val.data.interviews;
      result.forEach(offer => {
        offer.candidate.image = this.profileService.convertImagePath(offer.candidate.image, 'img')
        offer.company.image = this.profileService.convertImagePath(offer.company.image, 'img')
      })
      return result;
    }).catch(err => {
      return result;
    })
  }

  interviewHistory() {
    let result: IInterview[];
    return this.apiServices.interviewHistory().then(val => {
      result = val.data.interviews;
      result.forEach(offer => {
        offer.candidate.image = this.profileService.convertImagePath(offer.candidate.image, 'img')
        offer.company.image = this.profileService.convertImagePath(offer.company.image, 'img')
      })
      return result;
    }).catch(err => {
      return result;
    })
  }

  async removeCalendarEvents(id: number) {
    let result: IGenericCommonResponse<IEvent> = {};
    await this.apiServices.removeCalendarEvents(id).then(val => {
      if (val.errors || !val.data.is_deleted) {
        result.error = this.commonService.transformServerErrorV2(val.errors);
      } else {
        result.data = val.data;
      }
    }).catch(err => {
      result.errors = this.commonService.transformServerErrorV2(err.error.errors, err);
    });
    return result;
  }

}
