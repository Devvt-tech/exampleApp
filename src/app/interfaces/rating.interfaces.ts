import { IGenericCommonResponse } from "./common.interface";

export interface IRatingResponse {
    user_rating: {
        assessment_total: number;
    }
    
}

export interface IGetRatingResponse extends IGenericCommonResponse<IRatingResponse> {

}