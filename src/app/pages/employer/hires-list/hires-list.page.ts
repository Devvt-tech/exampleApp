import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ModalController, PopoverController } from '@ionic/angular';
import { EmployeeReviewModalComponent } from 'src/app/components/employee-review-modal/employee-review-modal.component';
import { HiresFilterComponent } from 'src/app/components/hires-filter/hires-filter.component';
import { RatingPopoverComponent } from 'src/app/components/rating-popover/rating-popover.component';
import { IHire } from 'src/app/interfaces/hires.interface';
import { DataService } from 'src/app/services/data.service';
import { HiresService } from 'src/app/services/hires.service';

@Component({
  selector: 'app-hires-list',
  templateUrl: './hires-list.page.html',
  styleUrls: ['./hires-list.page.scss'],
})
export class HiresListPage implements OnInit {

  headerHideOnScroll = false;
  headerFixOnScroll = false;
  isSearchOpened = false;
  public hires: IHire[];
  public isCompany: boolean;

  constructor(
    private modalController: ModalController,
    private actRoute: ActivatedRoute,
    private ds: DataService,
    private hiresService: HiresService,
    private popoverController: PopoverController,
    private router: Router
  ) {
    actRoute.data.subscribe(data => {
      this.hires = data.hires;
    })
  }

  ngOnInit() {
    this.isCompany = this.ds.isCompany;
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

  async openFilter() {
    const modal = await this.modalController.create({
      component: HiresFilterComponent,
      cssClass: 'fullpage-modal',
    });
    return await modal.present();
  }

  async leaveReview(hire?: IHire) {
    const user = this.isCompany ? hire.candidate : hire.company;
    const modal = await this.popoverController.create({
      component: RatingPopoverComponent,
      cssClass: 'fullpage-modal',
      componentProps: {user: user, offerId: hire.id}
    });
    modal.onDidDismiss().then(async val => {
      this.hires = await this.hiresService.getHires()
    })
    return await modal.present();
  }

  async loadInfo() {
    this.hires = await this.hiresService.getHires();
  }

  toProfile(id: number) {
    return
    const route = 'profile'; //this.ds.isCompany ? '/company-profile' : '/profile'
    this.router.navigate([`${route}/${id}`])
  }

}
