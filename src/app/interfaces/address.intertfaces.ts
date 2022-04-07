
export interface IAddress {
    id?: number;
    name: string;
    address: string;
}

export interface IAddressListResponse {
    items: IAddress[];
}
