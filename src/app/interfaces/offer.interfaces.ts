import { IAddress } from "./address.intertfaces";
import { IShortUser, IUser } from "./common.interface";
import { IVacancy } from "./vacancies.interfaces";

export class CreateOfferRequest {
    id: number
    user: number;
    vacancy_id: number;
    interview: string;
    description: string;
    dates: IOfferDate[];
}

export interface IOffer {
    id: number,
    from: IUser,
    from_id: number,
    to_id: number,
    job_id: number,
    city_id: number,
    areas: string,
    description: string;
    interview_type: string,
    status: string,
    work: string,
    jobName: string,
    job_name: string;
    to: IUser
    expirienceText: string;
    statusColor: string;
    text?: string;
    prittyDateTime: string;
    dates: IOfferDate[];
    vacancy: IVacancy;

    start_date: string;
    start: string;
    name: string;

    company: IShortUser;
    candidate: IShortUser;
    
    company_rating_total: number;
    candidate_rating_total: number;
    company_address_id: number;
    company_address: IAddress;
    choose_time_user_id:number;
}

export interface IOfferFilter {
    from: string,
    to: string,
    status: number,
    position: number,
    aviability: number,
    search: string
}

export interface IOfferDate {
    date?: string;
    from_time?: string;
    to_time?: string;
    id?: number;
    busy?: boolean;
    busyText?: string;
    slot: number;
}

export interface IProposeDateTimeRequest {
    offer_id: number;
    dates: IOfferDate[];
}

export interface IInterviewResponse {
    offers: IOffer[]
    countDates: any;
}

export interface IGetInterviewsRequest {
    date: string;
    search: string;
    from: string;
    to: string;
}

export interface IOfferList {
    items: IOffer[]
}