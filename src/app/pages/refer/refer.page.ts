import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-refer',
  templateUrl: './refer.page.html',
  styleUrls: ['./refer.page.scss'],
})
export class ReferPage implements OnInit {

  isLinkGenerated: boolean;

  constructor() { }

  ngOnInit() {
  }

  generateLink() {
    this.isLinkGenerated = true;
  }

}
