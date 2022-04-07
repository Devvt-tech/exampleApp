import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import * as moment from 'moment';
import { Moment } from 'moment';
import { IQuizz } from '../interfaces/quizzes.interface';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class QuizzesService implements Resolve<IQuizz[]> {

  constructor(
    private apiService: ApiService
  ) { }

  async resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<IQuizz[]> {
    return await this.getQuizzes();
  }

  getQuizzes() {
    let result: IQuizz[] = [];
    return this.apiService.getQiuzzes()
    .then(quizzes => {
      this.setPercent(quizzes);
      this.setTextInterval(quizzes);
      return quizzes
    })
    .catch(err => {
      return result
    })
  }

  setPercent(quizzes: IQuizz[]) {
    quizzes.forEach(quizz => {
      quizz.quiz_rating.forEach(rat => {
        rat.percRating = Number(rat.rating.replace('%', ''))
      })
    })
  }

  setTextInterval(quizzes: IQuizz[]) {
    quizzes.forEach(quizz => {
      let date: Moment;
      if (quizz.quiz_rating.length > 0) {
        date = moment(quizz.quiz_rating[0].date);
        const end = moment(quizz.quiz_rating[0].date).add(quizz.experience, 'month');
        const betw = end.diff(moment(), 'month') + 1;
        quizz.textInterval = `${betw} monts`
      };
    })
  }

}
