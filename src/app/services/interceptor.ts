import {
    HttpInterceptor,
    HttpRequest,
    HttpHandler,
    HttpEvent
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';
import { DataService } from './data.service';

@Injectable()
export class Interceptor implements HttpInterceptor {

    constructor(
        private dataService: DataService
    ) { }

    intercept(
        req: HttpRequest<any>,
        next: HttpHandler
    ): Observable<HttpEvent<any>> {
        const token = this.dataService.token;
        const duplicate = req.clone({
            setHeaders: {
                'Authorization': token ? `Bearer ${token}` : '',
                'Timezone': (0 - (new Date().getTimezoneOffset() / 60)).toString()
            }
        });
        return next.handle(duplicate);
    }
}
