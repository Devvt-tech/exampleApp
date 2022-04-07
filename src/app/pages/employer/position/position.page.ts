import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ModalController, PopoverController } from '@ionic/angular';
import { PositionApplicationActionsPopoverComponent } from 'src/app/components/position-application-actions-popover/position-application-actions-popover.component';
import { IVacancy } from 'src/app/interfaces/vacancies.interfaces';

@Component({
  selector: 'app-position',
  templateUrl: './position.page.html',
  styleUrls: ['./position.page.scss'],
})
export class PositionPage implements OnInit {

  vacancy: IVacancy;
  employmName: string;
  employmNames = new Array<string>();

  constructor(
    private popoverController: PopoverController,
    private modalController: ModalController,
    private router: Router
  ) {
  }

  ngOnInit() {
    this.vacancy = this.router.getCurrentNavigation().extras.state?.vac as IVacancy;
    if (this.vacancy.employment.toString().includes('1')) {
      this.employmNames.push("Full time");
    }
    if (this.vacancy.employment.toString().includes('2')) {
      this.employmNames.push("Part time");
    }
    if (this.vacancy.employment.toString().includes('3')) {
      this.employmNames.push("On demand");
    }
    this.employmName = this.employmNames.toString();
  }

  ionViewWillEnter() {
  }

  async positionApplicationActions(ev: any) {
    const popover = await this.popoverController.create({
      component: PositionApplicationActionsPopoverComponent,
      // cssClass: 'info-popover',
      event: ev,
      translucent: false,
      mode: 'md'
    });
    await popover.present();

    const { role } = await popover.onDidDismiss();
    console.log('onDidDismiss resolved with role', role);
  }

}
