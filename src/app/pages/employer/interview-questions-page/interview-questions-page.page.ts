import { Component, OnInit, ViewChild } from '@angular/core';
import { IonContent } from '@ionic/angular';

@Component({
  selector: 'app-interview-questions-page',
  templateUrl: './interview-questions-page.page.html',
  styleUrls: ['./interview-questions-page.page.scss'],
})
export class InterviewQuestionsPagePage implements OnInit {

  isEditingQuestion: boolean[] = [];
  addQuestionInput: boolean;

  questionsList = [
    {
      text: 'Lorem ipsum dolor sit amet consectetur adipisicing elit?',
    },
    {
      text: 'Lorem ipsum dolor sit amet consectetur adipisicing elit, lorem ipsum dolor sit amet consectetur adipisicing elit?',
    },
    {
      text: 'Lorem ipsum dolor sit amet consectetur adipisicing elit?',
    },
    {
      text: 'Lorem ipsum dolor sit amet consectetur adipisicing elit?',
    },
    {
      text: 'Lorem ipsum dolor sit amet consectetur adipisicing elit?',
    },
    {
      text: 'Lorem ipsum dolor sit amet consectetur adipisicing elit?',
    },
    {
      text: 'Lorem ipsum dolor sit amet consectetur adipisicing elit?',
    },
  ];

  @ViewChild('content') private content: any;

  constructor() { }

  ngOnInit() {
  }

  edit(i) {
    console.log(i);
    this.isEditingQuestion[i] = true;
  }

  editClose(i) {
    this.isEditingQuestion[i] = false;
  }

  addQuestion() {
    this.addQuestionInput = true;

    // let yOffset = document.getElementById('newQuestionInput').offsetTop + document.getElementById('newQuestionInput').offsetHeight;
    setTimeout(() => {
      let yOffset = document.getElementById('newQuestionInput').offsetTop + 160;  
      this.content.scrollToPoint(0, yOffset);
    }, 0)
    
    // document.getElementById('newQuestionInput').scrollIntoView({
    //   behavior: 'smooth',
    //   block: 'center'
    // });
  }

  addQuestionClose() {
    this.addQuestionInput = false;
    
  }

  

}
