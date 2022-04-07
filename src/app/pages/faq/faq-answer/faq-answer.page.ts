import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { IFaqQuestion } from 'src/app/interfaces/faq.interfaces';

@Component({
  selector: 'app-faq-answer',
  templateUrl: './faq-answer.page.html',
  styleUrls: ['./faq-answer.page.scss'],
})

export class FaqAnswerPage implements OnInit {

  question: IFaqQuestion;

  constructor(
    private actRoute: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    this.question = this.router.getCurrentNavigation().extras.state?.ques as IFaqQuestion;
  }

}
