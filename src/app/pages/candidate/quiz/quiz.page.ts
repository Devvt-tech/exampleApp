import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { combineLatest } from 'rxjs';
import { IQuestion, ISaveQuestion, ISaveQuizzRequest } from 'src/app/interfaces/quizzes.interface';
import { QuizzService } from 'src/app/services/quizz.service';

@Component({
  selector: 'app-quiz',
  templateUrl: './quiz.page.html',
  styleUrls: ['./quiz.page.scss'],
})
export class QuizPage implements OnInit {

  isQuizComplete = false;
  questions: IQuestion[];
  form: FormGroup;
  questCount: number;
  answeredPercent: number;
  quizzId: number;
  savedRating: number;

  constructor(
    private actRoute: ActivatedRoute,
    private quizzService: QuizzService
  ) {

    combineLatest([actRoute.data, actRoute.params]).subscribe(val => {
      this.questions = val[0].data;
      this.quizzId = Number(val[1].id);
    })

  }

  ngOnInit() {
    this.questCount = this.questions.length;
    this.form = this.buildForm(this.questions);
  }

  getAnsveredPercent() {
    let result = 0;
    this.questions.forEach(quest => {
      const val = this.form.get(quest.id.toString()).value;
      result = val ? result + (1 / this.questCount) : result;
    })
    return result;
  }

  buildForm(questions: IQuestion[]) {
    const result = new FormGroup({});
    questions.forEach(val => {
      result.addControl(val.id.toString(), new FormControl(null, [Validators.required]))
    });
    result.valueChanges.subscribe(val => {
      this.answeredPercent = this.getAnsveredPercent();
    })
    return result;
  }

  async save() {
    const request: ISaveQuizzRequest= {
      quizz_id: this.quizzId,
      questions: []
    }
    this.questions.forEach(quest => {
      const question: ISaveQuestion = {
        id: quest.id,
        answer_id: Number(this.form.get(quest.id.toString()).value)
      }
      request.questions.push(question);
      
    })
    const resp = await this.quizzService.saveQuizz(request);
    this.savedRating = Number(resp.ratings.replace('%', ''))
    this.isQuizComplete = true;
  }

}
