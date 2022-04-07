import { IAddress } from "./address.intertfaces";
import { IArea, ICity } from "./location.interface";

export interface ICreateVacancyRequest {
    vacancy_id?: number;
    job_id: number;
    employment: number;
    from: number;
    to: number;
    description: string;
    city_id: number;
    areas: number[];
    company_address_id: number;
}

export interface IVacancy {
    id: number;
    job_id: number;
    employment: number;
    from: number;
    to: number;
    description: string;
    user_id: number;
    //jobName: string;
    status: string;
    statusColor: string;
    job: IJob;
    areas: IArea[];
    city: ICity;
    job_name: string;
    city_name: string;
    company_address: IAddress
}

export interface IJob {
    id: number;
    name: string;
}

export interface IShortVacancy {
    city_name: string;
    district_names: []
    job_name: string;
}

