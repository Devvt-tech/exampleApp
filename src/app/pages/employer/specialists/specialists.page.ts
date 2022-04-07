import { Component, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ModalController, PopoverController } from '@ionic/angular';
import { MakeOfferComponent } from 'src/app/components/make-offer/make-offer.component';
import { IUser } from 'src/app/interfaces/common.interface';
import { SpecialistsFilterComponent } from 'src/app/components/specialists-filter/specialists-filter.component';
import { SpecialistService } from 'src/app/services/specialist.service';
import { ISpecialistFilter } from 'src/app/interfaces/specialist.interfaces';
import { DataService } from 'src/app/services/data.service';
import { CompanyOffersService } from 'src/app/services/company-offers.service';
import { ToastService } from 'src/app/services/toast.service';
import { SortPopoverComponent } from 'src/app/components/sort-popover/sort-popover.component';

@Component({
  selector: 'app-specialists',
  templateUrl: './specialists.page.html',
  styleUrls: ['./specialists.page.scss'],
})
export class SpecialistsPage implements OnInit {

  isBookmark: boolean;
  specialists: IUser[];
  form: FormGroup;
  filterForm: FormGroup;
  activeFiltersCount: number = 0;
  isSavedPage: boolean;

  constructor(
    private modalController: ModalController,
    private activatedRoute: ActivatedRoute,
    private specialistService: SpecialistService,
    private ds: DataService,
    private companyOffersService: CompanyOffersService,
    private toastService: ToastService,
    private router: Router,
    private popoverController: PopoverController,
  ) {
    activatedRoute.data.subscribe(data => {
      this.specialists = data.spesialists;
      ds.user$.next(data.user);
    });
    activatedRoute.params.subscribe(params => {
      this.isSavedPage = !!params.pageType;
      this.isBookmark = this.isSavedPage
    })
  }

  ngOnInit() {
    this.form = this.buildForm();
    this.form.valueChanges.subscribe(v => {
      this.applyFilter()     
    })
    this.filterForm = this.specialistService.buildFilterForm();
  }

  buildForm() {
    const result = new FormGroup({
      name: new FormControl(''),
      full_time: new FormControl(true),
      part_time: new FormControl(true),
      on_demand: new FormControl(true),
    });
    return result;
  }



  bookmark() {
    this.isBookmark = !this.isBookmark;
    this.router.navigate([`specialists/${this.isBookmark ? 'saved' : ''}`])
  }

  async openFilter() {
    const modal = await this.modalController.create({
      component: SpecialistsFilterComponent,
      cssClass: 'fullpage-modal',
      componentProps: {
        filterFormValue: this.filterForm.value
      }
    });
    modal.onDidDismiss().then(async data => {
      this.filterForm = this.specialistService.buildFilterForm(data.data.filterValue)
      if (!data.data.isCanceled) {
        this.activeFiltersCount = this.getActiveFiltersCount(data.data.filterValue);
        this.applyFilter();
      }
    })
    return await modal.present();
  }

  getActiveFiltersCount(filters: ISpecialistFilter) {
    let result = 0;
    result = filters.experience && filters.experience !== 'all' ? ++result : result;
    result = filters.city ? ++result : result;
    result = filters.areas && filters.areas.length > 0 ? ++result : result;
    result = filters.ratingFrom || filters.ratingTo ? ++result : result;
    result = filters.covid !== null ? ++result : result;
    result = filters.job_name !== null ? ++result : result;
    return result;
  }

  async applyFilter() {
    let request: ISpecialistFilter = {};
    Object.assign(request, this.form.value);
    request = {...request, ...this.filterForm.value };
    request.city = this.filterForm.get('city').value?.id;
    request.areas = this.filterForm.get('areas').value.map(val => {return val.id});
    const response = await this.specialistService.filterSpecialist(request);
    if (!response['errors']) {
      this.specialists = response;
    }
  }

  testFilter() {
    this.applyFilter()
  }

  async blockUser(id: number) {
    const result = await this.companyOffersService.blockOffer(id)
    if (result) {
      this.toastService.showSuccessToast();
      this.specialists = await this.specialistService.loadSpecialistList();
    }
  }

  ionViewDidLeave() {
    this.filterForm = this.specialistService.buildFilterForm()
  }

  async openSort(ev: any) {
    const popover = await this.popoverController.create({
      component: SortPopoverComponent,
      event: ev,
      translucent: false,
    });
    popover.onDidDismiss().then(val => {
      val.data?.rating === 'highest' && this.sortHighest('rating_total')
      val.data?.rating === 'lowest' && this.sortLowest('rating_total')
      val.data?.id === 'highest' && this.sortHighest('id')
      val.data?.id === 'lowest' && this.sortLowest('id')
    })
    popover.present()
  }

  sortLowest(field: string) {
    let result: number;
    this.specialists.sort((spec1, spec2) => {
      if (spec1[field] > spec2[field]) {
        result = 1;
      } else if (spec1[field] < spec2[field]) {
        result = -1;
      } else {
        result = 0
      }
      return result;
    })
  }

  sortHighest(field: string) {
    let result: number;
    this.specialists.sort((spec1, spec2) => {
      if (spec1[field] < spec2[field]) {
        result = 1;
      } else if (spec1[field] > spec2[field]) {
        result = -1;
      } else {
        result = 0
      }
      return result;
    })
  }

}
