import { Component, OnInit } from '@angular/core';
import { ModalController, Platform, PopoverController } from '@ionic/angular';
import { DataService } from 'src/app/services/data.service';
import { ProfileService } from 'src/app/services/profile.service';
import { StorageService } from 'src/app/services/storage.service';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { MediaCapture, MediaFile, CaptureError, CaptureImageOptions, CaptureVideoOptions } from '@ionic-native/media-capture/ngx';
import { environment } from 'src/environments/environment';
import { CommonService } from 'src/app/services/common.service';
import { HttpClient } from '@angular/common/http';
import { InfoPopoverComponent } from 'src/app/components/info-popover/info-popover.component';
import { AvailabilityComponent } from 'src/app/components/availability/availability.component';
import { WorkLocationComponent } from 'src/app/components/work-location/work-location.component';
import { BehaviorSubject } from 'rxjs';
import { IAvailabilities, IAvailabilityResponse, IEmploymentTypes, IPosition, IProfile, IUser } from 'src/app/interfaces/common.interface';
import { AbstractControl, FormArray, FormControl, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { AvailabilityService } from 'src/app/services/availability.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastService } from 'src/app/services/toast.service';
import { Crop } from '@ionic-native/crop/ngx';
import { DAYS_ARRAY, FIELD_IS_REQUIRED, TYPE_OF_JOB, VIDEO_POSTER } from 'src/constants';
import * as moment from 'moment';
import { LocationService } from 'src/app/services/location.service';
import { LoadingService } from 'src/app/services/loading.service';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { CertificatesUploadPage } from '../candidate/certificates-upload/certificates-upload.page';
import { IQuizz } from 'src/app/interfaces/quizzes.interface';
import { IAddress } from 'src/app/interfaces/address.intertfaces';
import { AddAddressComponent } from 'src/app/components/add-address/add-address.component';
import { AddressService } from 'src/app/services/address.service';

@Component({
  selector: 'app-profile-form',
  templateUrl: './profile-form.page.html',
  styleUrls: ['./profile-form.page.scss'],
})
export class ProfileFormPage implements OnInit {

  hideOnScroll: boolean;
  headerHideOnScroll = false;
  headerFixOnScroll = false;
  fileName: string;
  private baseApiUrl = environment.baseApiUrl;
  private baseUrl = environment.baseUrl;
  formData = new FormData();
  localImg: string;
  localVideo$ = new BehaviorSubject<string>('');
  localVideo: SafeUrl;
  serverImg: string;
  serverVideo: string;
  user: IUser;
  form: FormGroup;
  positions = new FormArray([]);
  interestingJobs = new FormArray([]);
  formLoaded: boolean;
  daysArray = DAYS_ARRAY;
  availabilities: IAvailabilityResponse;
  isCompany: boolean;
  descriptionLength: number;
  dataPickerMaxDate = moment().add(1, 'year').format('YYYY');
  public fieldIsRequired = FIELD_IS_REQUIRED;
  typeOfJobs = TYPE_OF_JOB;
  isIOS: boolean;
  poster = VIDEO_POSTER;
  quizzes: IQuizz[];
  resumePath: string;
  percent: number;
  addresses: IAddress[];

  get hasAvailabilities(): boolean {
    return !!!this.availabilities || (Object.keys(this.availabilities).length > 0)
  }

  constructor(
    public popoverController: PopoverController,
    public modalController: ModalController,
    private profileService: ProfileService,
    private storageService: StorageService,
    private ds: DataService,
    private camera: Camera,
    private mediaCapture: MediaCapture,
    private commonService: CommonService,
    private http: HttpClient,
    private availabilityService: AvailabilityService,
    private router: Router,
    private actRoute: ActivatedRoute,
    private toastService: ToastService,
    private crop: Crop,
    private locationService: LocationService,
    private platform: Platform,
    private loadingService: LoadingService,
    private sanitizer: DomSanitizer,
    private addressService: AddressService
  ) {
    actRoute.data.subscribe(data => {
      this.user = data.user as IUser;
      this.quizzes = data.quizzes as IQuizz[];
      this.resumePath = data.resumePath;
      this.percent = this.form && this.availabilities && this.buildInfoForPercent();
      this.addresses = data.addresses
    })
  }

  ngOnInit() {
    this.isIOS = this.platform.is('ios');
  }

  buildFormCandidate() {
    const result = new FormGroup({
      positions: new FormArray([]),
      // from: new FormControl(this.user.from, [Validators.required]),
      // to: new FormControl(this.user.to, [Validators.required]),
      summery: new FormControl(this.user?.summery || null),
      types_employment: new FormControl(this.profileService.getReadyToWorkArray(this.user.types_employment), [Validators.required]),
      covid: new FormControl(this.user.covid, [Validators.required]),
      facebook: new FormControl(this.user.facebook),
      instagram: new FormControl(this.user.instagram),
      twitter: new FormControl(this.user.twitter),
      name: new FormControl(this.user.name, [Validators.required]),
      city: new FormControl(this.user.city, [Validators.required]),
      image: new FormControl(this.user.image, [Validators.required]),
      interesting_jobs: new FormArray([])
    });
    if (this.user?.positions) {
      if (this.user?.positions.length === 0) {
        this.addPosition(result);
      }
      this.user.positions.forEach(p => {
        const posGroup = new FormGroup({
          name: new FormControl(p.name, [Validators.required]),
          from: new FormControl(p.from, [Validators.required]),
          to: new FormControl(p.to, [Validators.required]),
          radio: new FormControl('experience'),
          experience: new FormControl(p.experience, [Validators.required])
        });
        (result.get('positions') as FormArray).push(posGroup);
      })
    }
    this.positions = result.get('positions') as FormArray;
    
    if (this.user?.interesting_jobs && this.user?.interesting_jobs.length > 0) {
      this.user.interesting_jobs.forEach(value => {
        (result.get('interesting_jobs') as FormArray).push(new FormControl(value, [Validators.required]))
      })
    }
    this.interestingJobs = result.get('interesting_jobs') as FormArray;

    result.valueChanges.subscribe(val => {
      this.percent = this.form && this.availabilities && this.buildInfoForPercent()
    })

    return result;
  }


  buildFormCompany() {
    const result = new FormGroup({
      summery: new FormControl(this.user?.summery || null, [Validators.required]),
      job_id: new FormControl(1, [Validators.required, this.jobIdValid()]),
      facebook: new FormControl(this.user.facebook),
      instagram: new FormControl(this.user.instagram),
      twitter: new FormControl(this.user.twitter),
      name: new FormControl(this.user.name, [Validators.required]),
      image: new FormControl(this.user.image, [Validators.required]),
      city: new FormControl(this.user.city, [Validators.required]),
    });
    this.descriptionLength = result.get('summery')?.value?.length || 0
    result.get('summery').valueChanges.subscribe(val => {
      this.descriptionLength = val.length;
    })
    return result;
  }

  async ionViewWillEnter() {
    this.formData = new FormData();
    this.isCompany = this.ds.isCompany;
    await this.initProfile(this.isCompany ? 'profileCompany' : 'profile');
    this.form = this.isCompany ? this.buildFormCompany() : this.buildFormCandidate();
    this.formLoaded = true;
    this.localVideo$.subscribe(val => {
      if (val) {
        this.localVideo = this.sanitizer.bypassSecurityTrustUrl(val);
        setTimeout(() => {
          this.initVideo();
        }, 0)
      }
    })
    //this.locationModal();
  }

  async initProfile(url: string) {  
    this.user = await this.profileService.getProfile();
    this.ds.user$.next(this.user);
    this.availabilities = this.user.availability;
    if (this.user.image) {
      this.serverImg = this.user.image;
    }
    if (this.user.video) {
      this.serverVideo = `${this.baseUrl}public/storage/video/${this.user.video.split('/')[2]}`;
    }
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

  async infoPopover(ev: any) {
    const popover = await this.popoverController.create({
      component: InfoPopoverComponent,
      cssClass: 'info-popover',
      event: ev,
      translucent: false,
      mode: 'ios'
    });
    await popover.present();

    const { role } = await popover.onDidDismiss();
    console.log('onDidDismiss resolved with role', role);
  }

  async availabilityModal() {
    const modal = await this.modalController.create({
      component: AvailabilityComponent,
      cssClass: 'fullpage-modal'
    });
    modal.onDidDismiss().then(v => {
      this.initProfile(this.isCompany ? 'profileCompany' : 'profile');
    })
    return await modal.present();
  }

  async locationModal() {
    this.form.get('city').markAllAsTouched();
    const modal = await this.modalController.create({
      component: WorkLocationComponent,
      cssClass: 'fullpage-modal',
      componentProps: {
        city: this.user.city,
        areas: this.user.areas
      }
    });
    modal.onDidDismiss().then(async val => {
      this.form.get('city').setValue(val.data.city)
      this.user = await this.profileService.getProfile();
    })
    return await modal.present();
  }

  selectPhoto() {
    this.form.get('image').markAllAsTouched();
    const cameraOptions: CameraOptions = {
      quality: 100,
      destinationType: this.camera.DestinationType.FILE_URI,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
      sourceType: this.camera.PictureSourceType.PHOTOLIBRARY
    };

    this.camera.getPicture(cameraOptions).then(async (file) => {
      const path = this.isIOS ? file : `file://${file}`;
      this.crop.crop(path, {quality: 100})
      .then(async cr => {
        let win: any = window;
        this.localImg = win.Ionic.WebView.convertFileSrc(cr);
        const blob = await this.commonService.getBlobByFullPath(cr);
        this.formData.set('img', blob);
        this.form.get('image').setValue(this.localImg);
      })
    }, (err) => {
      console.log('Camera issue:' + err);
    });
  }

  takePhoto() {
    this.form.get('image').markAllAsTouched();
    let options: CaptureImageOptions = {
      limit: 1
    }
    this.mediaCapture.captureImage(options).then(
      async (data: MediaFile[]) => {
        const fullPath = data[0].fullPath;
        this.crop.crop(fullPath)
        .then(async cr => {
          let win: any = window;
          this.localImg = win.Ionic.WebView.convertFileSrc(cr);
          const blob = await this.commonService.getBlobByFullPath(cr);
          this.formData.set('img', blob);
          this.form.get('image').setValue(this.localImg);
        })
      },
      (err: CaptureError) => console.error(err)
    );
  }

  recordVideo() {
    let options: CaptureVideoOptions = {
      limit: 1
    }
    this.mediaCapture.captureVideo(options).then(
      async (data: MediaFile[]) => {
        this.loadingService.showLoader();
        const fname = data[0].name;
        const fp = this.isIOS ? `file://${data[0].fullPath}` : data[0].fullPath;
        const splitPath = fp.split(fname);
        const fullPath = splitPath[0];
        let win: any = window;
        this.localVideo$.next(win.Ionic.WebView.convertFileSrc(fp));
        const blob = await this.commonService.blob(fullPath, fname);
        this.formData.set('video', blob);
        this.loadingService.hideLoader();
      },
      (err: CaptureError) => console.error(err)
    );
  }

  selectVideo() {
    const cameraOptions: CameraOptions = {
      quality: 100,
      destinationType: this.camera.DestinationType.NATIVE_URI,
      encodingType: this.camera.EncodingType.PNG,
      mediaType: this.camera.MediaType.VIDEO,
      sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
      correctOrientation: true
    };

    this.camera.getPicture(cameraOptions).then(async (file) => {
      this.loadingService.showLoader();
      let win: any = window;
      this.localVideo$.next(win.Ionic.WebView.convertFileSrc(file));
      const blob = await this.commonService.getBlobByFullPath(file);
      this.formData.set('video', blob);
      this.loadingService.hideLoader();
      this.initVideo();
    }, (err) => {
      console.log('Camera issue:' + err);
    });
  }

  save() {
    if (!this.isCompany) {
      const positions = this.buildPosition();
      const employment = this.getTypesEmploymentConvertFromForm();

      this.formData.set('types_employment[is_full_time]', employment.is_full_time.toString());
      this.formData.set('types_employment[is_part_time]', employment.is_part_time.toString());
      this.formData.set('types_employment[is_on_demand]', employment.is_on_demand.toString());

      this.formData.set('position', JSON.stringify(positions));
      this.formData.set('covid', this.form.get('covid').value);
      this.interestingJobs.controls.forEach((element, ind) => {
        this.formData.set(`interesting_jobs[${ind}]`, element.value);
      });
      this.formData.set('percent', this.percent.toString());
    } else {
      this.formData.set('job_id', this.form.get('job_id').value);
    }
    this.formData.set('summery', this.form.get('summery').value);
    this.formData.set('facebook', this.form.get('facebook').value);
    this.formData.set('instagram', this.form.get('instagram').value);
    this.formData.set('twitter', this.form.get('twitter').value);
    this.formData.set('name', this.form.get('name').value);

    this.http.post(`${this.baseApiUrl}${this.isCompany ? 'profileCompany' : 'profile'}`, this.formData).toPromise().then(val => {
      this.toastService.showSuccessToast();
      const route = this.ds.isCompany ? '/company-profile' : '/profile'
      this.router.navigate([`/${route}`]);
    }).catch(err => {
      this.toastService.showToast('Error');
    })
  }

  buildPosition() {
    const poss: IPosition[] = this.form.get('positions').value;
    const result: IPosition[] = [];
    poss.forEach(val => {
      let pos: IPosition = {
        name: val.name
      }
      if (val.radio === 'fromTo') {
        pos.from = val.from.split('T')[0];
        pos.to = val.to.split('T')[0];
        pos.experience = null;
      };

      if (val.radio === 'experience') {
        pos.from = null;
        pos.to = null;
        pos.experience = val.experience;
      };
      result.push(pos);

    })
    return result;
  }

  
  getTypesEmploymentConvertFromForm() {
    const arr: number[] = this.form.get('types_employment').value;

    const types: IEmploymentTypes = {
       is_full_time: arr.includes(1) ? 1 : 0,
       is_part_time: arr.includes(2) ? 1 : 0,
       is_on_demand: arr.includes(3) ? 1 : 0
    };
    return types;
  }


  initVideo() {
    const video = document.getElementById('video') as any;
    video.pause();
    video.currentTime = 0;
    video.load();
  }

  addPosition(form: FormGroup) {
    const posGroup = new FormGroup({
      name: new FormControl(null, [Validators.required]),
      from: new FormControl(null, [Validators.required]),
      to: new FormControl(null, [Validators.required]),
      radio: new FormControl('experience', [Validators.required]),
      experience: new FormControl(null, [Validators.required])
    });
    (form.get('positions') as FormArray).push(posGroup);
  }

  remPosition(index: number) {
    (this.form.get('positions') as FormArray).removeAt(index);
  }

  deleteClick() {
    this.localVideo = '';
    this.serverVideo = '';
    this.formData.set('video', '');
  }


  jobIdValid(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: boolean } | null => {
        if (control.value == 0) {
            return { 'jobIdInvalid': true };
        }
        return null;
    };
  }

  onImageClick(url: string) {
    this.commonService.imageFullScreen(url)
  }

  addInterestingJob(form: FormGroup) {
    console.log(form);
    (form.get('interesting_jobs') as FormArray).push(new FormControl('', [Validators.required]))
  }

  remInterestingJob(index: number) {
    (this.form.get('interesting_jobs') as FormArray).removeAt(index);
  }

  async toCertificates(type: string) {
    const modal = await this.modalController.create({
      component: CertificatesUploadPage,
      componentProps: {
        type: type
      }
    });
    modal.present();
  }

  buildInfoForPercent() {
    const user = {...this.form.value,
      ...{availability: this.availabilities},
      ...{resumes: this.resumePath},
      ...{certificates: this.user.certificates}
    };
    let profile: IProfile = {
      user: user,
      quizzes: this.quizzes
    };
    return this.profileService.getCandidatePercent(profile);
  }

  async addAddress() {
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
    this.addresses = await this.addressService.loadAdressess();
  }

}
