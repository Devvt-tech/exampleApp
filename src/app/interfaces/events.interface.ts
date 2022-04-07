import { ICommonResponse, IGenericCommonResponse } from "./common.interface";
import { IInterview } from "./interview.interfaces";
import { IOffer } from "./offer.interfaces";

export interface IEvent {
    id: number;
    name: string;
    text: string;
    is_with_time: boolean;
    start_date: string;
    start_time?: string;
    end_date: string;
    end_time?: string;
    start: string;
    end: string;
    isEvent: boolean;
}

export interface ICalendarResponse extends IGenericCommonResponse<ICalendarInfo> {
}

export interface ICalendarInfo {
    interviews: IInterview[];
    events: IEvent[];
}

// export interface ICalendarEvent {
//     name: string;
//     text: string;
//     start: string;
//     start_date: string;
//     jobName?: string;
//     interview_type?: string;
//     isEvent: boolean;
//     status?: string;
// }

export interface IInterviewCountOfDate {
    strDate: string
    timeStamp: number;
    count: number;
}

export interface IEventDatesByRange {
    data: {
        dates: string[];
    }
    
}

export interface IEventResponse extends IGenericCommonResponse<IEvent> {

}

export interface ICreateEventRequest {
    name: string;
    start_datetime: string;
    end_datetime: string;
    is_with_time: boolean;
    text: string;
}