import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { ModalController, PopoverController } from '@ionic/angular';
import { AddPositionComponent } from 'src/app/components/add-position/add-position.component';
import { PositionActionsPopoverComponent } from 'src/app/components/position-actions-popover/position-actions-popover.component';
import { IVacancy } from 'src/app/interfaces/vacancies.interfaces';
import { DataService } from 'src/app/services/data.service';
import { VacanciesService } from 'src/app/services/vacancies.service';

@Component({
  selector: 'app-positions',
  templateUrl: './positions.page.html',
  styleUrls: ['./positions.page.scss'],
})

export class PositionsPage implements OnInit {

  headerHideOnScroll = false;
  headerFixOnScroll = false;
  isSearchOpened = false;
  vacancies: IVacancy[];
  isCompany: boolean;

  constructor(
    private popoverController: PopoverController,
    private modalController: ModalController,
    private activatedRoute: ActivatedRoute,
    private vacanciesService: VacanciesService,
    private router: Router,
    private ds: DataService
  ) {
    activatedRoute.data.subscribe(data => {
      this.vacancies = data.vacancies;
    })
  }

  ngOnInit() {
    this.isCompany = this.ds.isCompany
  }

  async positionActionsPopover(ev: any, vacancy: IVacancy) {
    const popover = await this.popoverController.create({
      component: PositionActionsPopoverComponent,
      // cssClass: 'info-popover',
      event: ev,
      translucent: false,
      mode: 'md',
      componentProps: {vacancy: vacancy}
    });
    popover.onDidDismiss().then(async val => {
      this.vacancies = await this.vacanciesService.getVacancies();
    })
    await popover.present();

  }

  async addPositionModal() {
    const modal = await this.modalController.create({
      component: AddPositionComponent,
      cssClass: 'fullpage-modal',
    });
    modal.onDidDismiss().then(async val => {
      this.vacancies = await this.vacanciesService.getVacancies();
    })
    return await modal.present();
  }

  onScroll(event) {   
    if (event.detail.scrollTop > 0) {      
      this.headerHideOnScroll = true;
      this.headerFixOnScroll = false;
      
      if (event.detail.deltaY <= 0 && event.detail.scrollTop > 100) {
        this.headerHideOnScroll = false;
        this.headerFixOnScroll = true;
      }
      
    } else {
      this.headerHideOnScroll = false;
      this.headerFixOnScroll = false;
    }
  }

  openSearch() {
    this.isSearchOpened = true;
  }

  closeSearch() {
    this.isSearchOpened = false;
  }

  toVacancy(vacancy: IVacancy) {
    const ext: NavigationExtras = {
      state: {vac: vacancy}
    }
    this.router.navigate(['position'], ext);
  }

}
