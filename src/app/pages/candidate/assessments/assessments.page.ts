import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MenuController } from '@ionic/angular';
import { IQuizz } from 'src/app/interfaces/quizzes.interface';
// import { MenuController } from '@ionic/angular';

@Component({
  selector: 'app-assessments',
  templateUrl: './assessments.page.html',
  styleUrls: ['./assessments.page.scss'],
})
export class AssessmentsPage implements OnInit {

  isShowQuizzes: boolean = true;
  isShowAssessments: boolean;
  quizzes: IQuizz[];

  constructor(
    private actRoute: ActivatedRoute,
    private menuCtrl: MenuController,
    private router: Router
  ) {
    actRoute.data.subscribe(data => {
      this.quizzes = data.quizzes;
    })
  }

  ngOnInit() {
  }

  ionViewWillLeave() {
    this.menuCtrl.close();
  }

  ionViewWillEnter() {
    //this.menuCtrl.close('candidateMenu');
    this.menuCtrl.close();
  }

  showQuizzes() {
    this.isShowQuizzes = true;
    this.isShowAssessments = false;
  }

  showAssessments() {
    this.isShowQuizzes = false;
    this.isShowAssessments = true;
  }

  close() {
    this.router.navigate(['profile'])
  }

}
