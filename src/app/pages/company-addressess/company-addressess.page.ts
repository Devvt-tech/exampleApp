import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ModalController, PopoverController } from '@ionic/angular';
import { AddAddressComponent } from 'src/app/components/add-address/add-address.component';
import { AddressActionsPopoverComponent } from 'src/app/components/address-actions-popover/address-actions-popover.component';
import { IAddress } from 'src/app/interfaces/address.intertfaces';
import { AddressService } from 'src/app/services/address.service';

@Component({
  selector: 'app-company-addressess',
  templateUrl: './company-addressess.page.html',
  styleUrls: ['./company-addressess.page.scss'],
})
export class CompanyAddressessPage implements OnInit {

  headerHideOnScroll = false;
  headerFixOnScroll = false;
  addresses: IAddress[];

  constructor(
    private modalController: ModalController,
    private popoverController: PopoverController,
    private actRoute: ActivatedRoute,
    private addressService: AddressService
    
  ) {
    actRoute.data.subscribe(data => {
      this.addresses = data.addresses;
    })
  }

  ngOnInit() {
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

  async addAddressModal() {
    const modal = await this.modalController.create({
      component: AddAddressComponent,
      cssClass: 'fullpage-modal',
    });
    modal.onDidDismiss().then(async val => {
      this.addresses = this.addresses = await this.addressService.loadAdressess();
    })
    return await modal.present();
  }

  async updateAddressList() {
    this.addresses = await this.addressService.loadAdressess()
  }

}
