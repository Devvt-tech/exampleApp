import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { OperatingHoursComponent } from 'src/app/components/operating-hours/operating-hours.component';

@Component({
  selector: 'app-company-profile-form',
  templateUrl: './company-profile-form.page.html',
  styleUrls: ['./company-profile-form.page.scss'],
})
export class CompanyProfileFormPage implements OnInit {

  headerHideOnScroll = false;
  headerFixOnScroll = false;

  constructor(
    private modalController: ModalController,
  ) { }

  ngOnInit() {
  }

  async operatingHoursModal() {
    const modal = await this.modalController.create({
      component: OperatingHoursComponent,
      cssClass: 'fullpage-modal'
    });
    modal.onDidDismiss().then(v => {
      // this.loadProfile(this.isCompany ? 'profileCompany' : 'profile');
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

  save() {

  }

  selectPhoto() {

  }

  takePhoto() {

  }

}
