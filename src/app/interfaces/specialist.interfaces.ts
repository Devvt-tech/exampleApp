

export interface ISpecialistFilter {
    name?: string;
    full_time?: boolean;
    part_time?: boolean;
    on_demand?: boolean;
    query_text?: string;
    experience?: string;

    sort_by?: number;
    city?: number;
    areas?: number[];
    ratingFrom?: number
    ratingTo?: number
    covid?: boolean;
    job_name?: number
}

export interface ISpecialistFilterRequest {
    full_time?: number;
    part_time?: number;
    on_demand?: number;
    query_text?: string;
    experience?: string;

    sort_by?: number;
    city?: number;
    areas?: number[];
    ratingFrom?: number
    ratingTo?: number
    covid?: boolean;
}