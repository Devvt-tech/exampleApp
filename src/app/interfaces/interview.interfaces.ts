import { IGenericCommonResponse, IShortUser } from "./common.interface";
import { IOffer } from "./offer.interfaces";
import { IShortVacancy } from "./vacancies.interfaces";


export interface IInterviewList {
    interviews: IInterview[]
}

export interface IInterview {
    candidate: IShortUser;
    company: IShortUser;
    description: string;
    hired_status: string;
    id: number;
    interview_type: string;
    meeting_times: IMeetingTimes[];
    vacancy: IShortVacancy,
    interview_online_join_url: string;
    status: string;
}

export interface IMeetingTimes {
    date: string;
    from_time: string;
    to_time: string;
}




