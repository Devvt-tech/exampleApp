import { IGenericCommonResponse, IShortUser } from "./common.interface";
import { IArea, ICity } from "./location.interface";
import { IOffer } from "./offer.interfaces";
import { IShortVacancy, IVacancy } from "./vacancies.interfaces";

export interface IHire {    
    // offer: IOffer
    // status: string;
    hireStatusText: string

    can_leave_rating: boolean;
    candidate: IShortUser;
    company: IShortUser;
    hired_status: string;
    id: number;
    interview_type: string;
    vacancy: IShortVacancy;
}

export enum HireStatusEnum {
    Decline = 1,
    Success = 2,
    Pending = 3
}

export interface IHireList {
    hires: IHire[];
}

export interface IHireListResponse extends IGenericCommonResponse<IHireList> {}

export interface ISaveReviewRequest {
    assessment: number;
    answers: any[]
}