import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, Resolve, ResolveData, RouterStateSnapshot } from "@angular/router";
import { Observable } from "rxjs";
import { IChat, IGetMessagesResponse, IMessage } from "src/app/interfaces/messages.interfaces";
import { MessagesService } from "src/app/services/messages.service";

@Injectable({
    providedIn: 'root'
})
export class ChatResolver implements Resolve<IGetMessagesResponse> {

    constructor(
        private messageService: MessagesService
    ) {}

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): IGetMessagesResponse | Promise<IGetMessagesResponse> | Observable<IGetMessagesResponse> {
        const chatId = Number(route.params.id);
        return this.messageService.loadMessageList(chatId);
    }

}