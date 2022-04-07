export interface IChat {
    name: string;
    icon: string;
    last_message: IMessage;
    message_number_unread: number;
    id: number;
}

export interface IMessage {
    text: string;
    created_at: string;
    prittyDate: string;
    icon: string;
    is_my: boolean;
    name: string;
    is_unread: boolean;
    id: number;
    isSelected: boolean;
}

export interface IChatListResponse {
    data?: {
        items: IChat[],
    }
}

export interface ICreateMessageRequest {
    receiver_id: number;
    message: string;
}

export interface ICreateMessageResponse {
    is_created: boolean;
    chat_id: number;
}

export interface IGetMessagesResponse {
    messages?: IMessage[];
    chat?: IChat;
    recipient_id?: number;
}

export interface IGetAllUnreadMessageNumber {
    total: number;
}

export interface IRemoveMessageResponse {
    is_deleted: boolean;
}