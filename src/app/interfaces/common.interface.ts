import { ICertificate } from "./certificate.interfaces";
import { IArea, ICity } from "./location.interface";
import { IQuizz } from "./quizzes.interface";

export interface ICommonResponse {
    errors?: any;
    error?: any;
}

export interface IGenericCommonResponse<T> extends ICommonResponse {
    data?: T;
}

export interface IUser {
    covid: string;
    created_at: string;
    email: string;
    email_verified_at: string;
    face_token: string;
    facebook: string;
    from: string;
    id: number
    image: string;
    instagram: string;
    job_id: number;
    name: string;
    phone: string;
    positions: IPosition[];
    raytings: number;
    role_id: number;
    summery: number;
    types_employment: IEmploymentTypes & [];
    to: string;
    twitter: string;
    updated_at: string;
    video: string;
    city: ICity;
    areas: IArea[];
    certificates: ICertificate[];
    resumes: ICertificate[];
    availability: IAvailabilityResponse;
    favorite?: boolean;
    rating_total: number;
    interesting_jobs: string[];
    is_any_offer: boolean;
}

export class IPosition {
    name: string;
    from?: string
    to?: string
    experience?: string;
    radio?: string;
}

export interface IAvailabilityResponse {
    monday: IAvailabilityInterval[];
    tuesday: IAvailabilityInterval[];
    wednesday: IAvailabilityInterval[];
    thursday: IAvailabilityInterval[];
    friday: IAvailabilityInterval[];
    saturday: IAvailabilityInterval[];
    sunday: IAvailabilityInterval[];
}

export interface IAvailabilityInterval {
    start: string;
    end: string;
}

export interface IAvailability {
    on: boolean;
    intervals: IAvailabilityInterval[];
}

export interface IAvailabilities {
    monday?: IAvailability;
    tuesday?: IAvailability;
    wednesday?: IAvailability;
    thursday?: IAvailability;
    friday?: IAvailability;
    saturday?: IAvailability;
    sunday?: IAvailability;
}

export interface IAvilabilitySaveRequest {
    monday?: IAvailabilityInterval[];
    tuesday?: IAvailabilityInterval[];
    wednesday?: IAvailabilityInterval[];
    thursday?: IAvailabilityInterval[];
    friday?: IAvailabilityInterval[];
    saturday?: IAvailabilityInterval[];
    sunday?: IAvailabilityInterval[];
}

export interface IShortUser {
    name: string;
    image: string;
    rating_total: number;
    id: number;
}

export interface IProfile {
    user: IUser;
    quizzes: IQuizz[];
}

export interface IEmploymentTypes {
    is_full_time: number,
    is_part_time: number,
    is_on_demand: number;
}

export interface INotification {
    body: string;
    sent_time: number;
    title?: string;
    name?: string;
    img?: string;
    candidate_id: number;
    company_id: number;
    id?: string;
}

export interface ISendEmailRequest {
    name?: string;
    phone?: string;
    email?: string;
    message?: string;
}