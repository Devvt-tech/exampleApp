import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { PreviewAnyFile } from '@ionic-native/preview-any-file/ngx';
import { ModalController } from '@ionic/angular';
import { AvailabilityComponent } from 'src/app/components/availability/availability.component';
import { IAvailabilityResponse, INotification, IProfile, IUser } from 'src/app/interfaces/common.interface';
import { IQuizz } from 'src/app/interfaces/quizzes.interface';
import { AvailabilityService } from 'src/app/services/availability.service';
import { CommonService } from 'src/app/services/common.service';
import { DataService } from 'src/app/services/data.service';
import { DAYS_ARRAY, TIME_OF_JOB, TYPE_OF_JOB, VIDEO_POSTER } from 'src/constants';
import { environment } from 'src/environments/environment';
import { File } from '@ionic-native/file/ngx';
import { HTTP } from '@ionic-native/http/ngx';
import { ToastService } from 'src/app/services/toast.service';
import { ICertificate } from 'src/app/interfaces/certificate.interfaces';
import { InAppBrowser, InAppBrowserOptions } from '@ionic-native/in-app-browser/ngx';
import { ProfileService } from 'src/app/services/profile.service';
import { CertificatesService } from 'src/app/services/certificates.service';
import { Subscription } from 'rxjs';
import { MakeOfferComponent } from 'src/app/components/make-offer/make-offer.component';
import { collection, doc, setDoc } from 'firebase/firestore';
import { Firestore, collectionData } from '@angular/fire/firestore';
import { map } from 'rxjs/operators';
import { ScheduleInterviewComponent } from 'src/app/components/schedule-interview/schedule-interview.component';
import { MessageCandidateComponent } from 'src/app/components/message-candidate/message-candidate.component';
import { MessagesService } from 'src/app/services/messages.service';


@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {

  hideOnScroll: boolean;
  headerHideOnScroll = false;
  headerFixOnScroll = false;
  user: IUser;
  serverImg: string;
  serverVideo: string;
  private baseUrl = environment.baseUrl;
  daysArray = DAYS_ARRAY;
  availabilities: IAvailabilityResponse;
  isCompany: boolean;
  covid: string;
  quizzes: IQuizz[];
  allQuizzes: boolean;
  resumePath: string;
  allCertificates: boolean;
  showExpirience: boolean;
  userId: number;
  rating: number;
  percent: number;
  poster = VIDEO_POSTER;

  private inAppBrowserOptions: InAppBrowserOptions= {
    zoom: 'no',
    hideurlbar: 'yes',
    hidenavigationbuttons: 'yes',
    location: 'no'
  }

  get expirienceText(): string {
    return this.commonService.getDifferentDatesText(this.user.from, this.user.to);
  }

  get typeOfJob(): string {
    return TYPE_OF_JOB[this.user.job_id - 1];
  }

  get timeOfJob() {
    const array = this.profileService.getReadyToWorkArray(this.user.types_employment);
    return array.map(val => {return TIME_OF_JOB[val - 1]})
  }

  constructor(
    public modalController: ModalController,
    private actRoute: ActivatedRoute,
    private commonService: CommonService,
    public ds: DataService,
    private previewAnyFile: PreviewAnyFile,
    private file: File,
    private http: HTTP,
    private toastService: ToastService,
    private iab: InAppBrowser,
    private profileService: ProfileService,
    private certificatesService: CertificatesService,
    private readonly firestore: Firestore,
    private messageService: MessagesService,
    private router: Router
  ) {
    actRoute.data.subscribe(data => {
      this.user = data.user as IUser;
      this.quizzes = data.quizzes as IQuizz[];
      this.resumePath = data.resumePath;
      this.rating = data.rating;
    });
    actRoute.params.subscribe(params => {
      this.userId = params.id ? Number(params.id) : null;
    })
  }

  ngOnInit() {
    if (this.user.resumes && this.user.resumes.length > 0) {
      const img = this.user.resumes[0].img as string;
      this.resumePath = this.baseUrl + 'public/storage/' + 'resume' + '/' + img?.split('/')[2];
    }
  }

  async loadProfile(url: string) {
    this.serverVideo = null;
    this.availabilities = this.user.availability;
    if (this.user.image) {
      this.serverImg = this.user.image;
    }
    if (this.user.video) {
      this.serverVideo = `${this.baseUrl}public/storage/video/${this.user.video.split('/')[2]}`;
    }
    this.covid = this.user.covid ? "Yes" : "No";
    this.buildInfoForPercent();
    
  }

  async ionViewWillEnter() {
    this.isCompany = this.ds.isCompany;
    await this.loadProfile(this.isCompany ? 'profileCompany' : 'profile');
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

  resumePreview() {
    this.previewAnyFile.preview(this.resumePath)
      .then((res: any) => console.log(res))
      .catch((error: any) => console.error(error));
  }

  resumeDownload() {
    const filename = this.resumePath.split('/').pop()
    const filePath = `${this.file.externalRootDirectory}/Download/${filename}`;
    // for iOS use this.file.documentsDirectory

    this.http.downloadFile(this.resumePath, {}, {}, filePath).then(response => {
      this.toastService.showToast('File was saving to Download directory');
    }).catch(err => {
      console.log('error block ... ', err.status);
      console.log('error block ... ', err.error);
    })
  }

  facebookClick() {
    this.openSocial(this.user.facebook);
  }

  instagramClick() {
    this.openSocial(this.user.instagram);
  }

  twitterClick() {
    this.openSocial(this.user.twitter);
  }

  
  openSocial(url: string) {
    if (!url.includes('http://')) {
      url = !url.includes('https://') ? 'https://' + url : url;
    }
    this.iab.create(url, '_system', this.inAppBrowserOptions);
  }

  updateAvailability() {
    this.loadProfile('profile');
  }

  async addToSaved() {
    const res = await this.profileService.addToSaved(this.user.id, this.ds.user$.value.id);
    if (res) {
      this.toastService.showToast(res);
      this.user = await this.profileService.getProfileById(this.userId);
    }
  }

  async removeFromSaved() {
    const res = await this.profileService.removeFromSaved(this.user.id, this.ds.user$.value.id);
    if (res) {
      this.toastService.showToast(res);
      this.user = await this.profileService.getProfileById(this.userId);
    }
  }

  onImageClick(url: string) {
    this.commonService.imageFullScreen(url);
  }

  buildInfoForPercent() {
    const profile: IProfile = {
      user: this.user,
      quizzes: this.quizzes
    }
    this.percent = this.profileService.getCandidatePercent(profile);
  }

  onDemand(event) {
    const val = event.detail.checked;
    this.profileService.changeOnDemand(val ? 1 : 0);
  }

  async makeOfferModal() {
    const modal = await this.modalController.create({
      component: MakeOfferComponent,
      cssClass: 'fullpage-modal',
      componentProps: {
        candidateId: this.user.id
      }
    });
    return await modal.present();
  }

  async scheduleInterviewModal() {
    const modal = await this.modalController.create({
      component: ScheduleInterviewComponent,
      cssClass: 'fullpage-modal',
      componentProps: {
        candidateId: this.user.id
      }
    });
    return await modal.present();
  }


  async readF() {
    const contactsCollection = collection(this.firestore, 'contacts');
    const data = collectionData(contactsCollection, {idField: 'id'}).pipe(
      map(notifs => notifs as INotification[])
    )
  }

  createF(): Promise<void> {
    const document = doc(collection(this.firestore, 'contacts'));
    return setDoc(document, {first: 1});
  }

  async messageCandidateModal() {
    const modal = await this.modalController.create({
      component: MessageCandidateComponent,
      cssClass: 'fullpage-modal',
      componentProps: {
        candidateId: this.user.id
      }
    });
    modal.onDidDismiss().then(async val => {
      if (await this.modalController.getTop()) {
        this.modalController.dismiss()
      }
      val.data.chatId && this.router.navigate([`/chat/${val.data.chatId}`]);
    })
    return await modal.present();
  }

}


