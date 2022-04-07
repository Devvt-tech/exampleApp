import { IUser } from "./common.interface";

export interface IRegisterRequest {
    role_id: number;
    phone: string;
    email: string;
    password: string;
    password_confirmation: string;
    name: string;
    device_token: string;
}

export interface IRegisterResponse {
    token: string;
}

export interface ICredentials {
    field1: string;
    field2: string;
}

export interface ILoginRequest {
    phone: string;
    password: string;
    device_token: string;
}

export interface ILoginResponse {
    response: {
        token: string;
    },
    user: IUser;
}

export interface IForgotRequest {
    email: string;
}

export interface IForgotResponse {
    successfully: string;
}