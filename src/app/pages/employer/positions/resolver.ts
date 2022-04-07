import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from "@angular/router";
import { Observable } from "rxjs";
import { IVacancy } from "src/app/interfaces/vacancies.interfaces";
import { DataService } from "src/app/services/data.service";
import { StorageService } from "src/app/services/storage.service";
import { VacanciesService } from "src/app/services/vacancies.service";

@Injectable({
    providedIn: 'root'
})
export class VacanciesResolver implements Resolve<IVacancy[]> {

    constructor(
        private vacanciesService: VacanciesService,
        private ds: DataService,
        private storageService: StorageService
    ) {}

    async resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<IVacancy[]> {
        this.ds.token = this.ds.token || await this.storageService.getTokenFromStorage()
        return await this.vacanciesService.getVacancies();
    }

}