import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { IQuestion, ISaveQuizzRequest, ISaveQuizzResponse } from '../interfaces/quizzes.interface';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})

export class QuizzService implements Resolve<IQuestion[]> {

  constructor(
    private apiService: ApiService
  ) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<IQuestion[]> {
    const id = Number(route.params.id);
    return this.getQuestions(id);
  }

  getQuestions(id: number) {
    let result: IQuestion[] = [];
    return this.apiService.getQuestions(id)
    .then(quests => {
      return quests
    })
    .catch(err => {
      return result
    })
  }

  saveQuizz(request: ISaveQuizzRequest) {
    let result: ISaveQuizzResponse;
    return this.apiService.saveQuizz(request)
    .then(resp => {
      return resp;
    })
    .catch(err => {
      return result
    })
  }

}
