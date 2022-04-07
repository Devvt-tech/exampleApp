import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { FingerprintAIO, FingerprintOptions } from '@ionic-native/fingerprint-aio/ngx';
import { MenuController } from '@ionic/angular';
import { menuController } from '@ionic/core';
import { ICredentials, ILoginRequest, ILoginResponse } from 'src/app/interfaces/auth.interface';
import { IGenericCommonResponse } from 'src/app/interfaces/common.interface';
import { ApiService } from 'src/app/services/api.service';
import { AuthService } from 'src/app/services/auth.service';
import { CommonService } from 'src/app/services/common.service';
import { DataService } from 'src/app/services/data.service';
import { StorageService } from 'src/app/services/storage.service';
import { ToastService } from 'src/app/services/toast.service';
import { FIELD_IS_REQUIRED } from 'src/constants';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  public form: FormGroup;
  public response: IGenericCommonResponse<ILoginResponse>;
  public showServerError: boolean;
  public fieldIsRequired = FIELD_IS_REQUIRED;
  public haveCredInStorage: boolean;
  public isAvailBio: boolean;
  public isDevServer: boolean;
  private bioOpt: FingerprintOptions = {
    disableBackup: true
  }
  public isShowPassword: boolean;

  constructor(
    private authService: AuthService,
    private router: Router,
    public commonService: CommonService,
    private storageService: StorageService,
    private ds: DataService,
    private faio: FingerprintAIO,
    private toastService: ToastService,
    private menuController: MenuController
  ) { }

  ngOnInit() {
    this.form = this.buildForm();
    this.isDevServer = !environment.production;
  }

  async ionViewWillEnter() {
    this.haveCredInStorage = await this.getHaveCredInStorage();
    this.isAvailBio = await this.authService.isAvailBio();
  }

  async getHaveCredInStorage() {
    const cred = await this.storageService.getCredentialFromStorage();
    return !!cred.field1 && !!cred.field2; 
  }

  async getCredInStorage() {
    return await this.storageService.getCredentialFromStorage();
  }

  private buildForm() {
    return new FormGroup({
      phone: new FormControl('', [Validators.required]),
      password: new FormControl('', [Validators.required])
    })
  }

  public async login(cred?: ICredentials) {
    let model: ILoginRequest = this.form.value;
    if (cred) {
      model.phone = cred.field1;
      model.password = cred.field2;
    };
    model.device_token = this.ds.deviceToken;
    Object.assign<ILoginRequest, any>(model, this.form.value);
    this.response = await this.authService.login(model);
    this.showServerError = !!this.response?.error;
    if (!this.response?.error) {
      this.ds.user$.next(this.response.data.user);
      this.ds.isCompany = this.ds.user$.value.role_id === 2;
      const route = this.ds.isCompany ? '/company-profile' : '/profile';
      this.router.navigate([`/${route}`], {replaceUrl: true})
    }
  }

  bioClick() {
    this.faio.show(this.bioOpt).then(async val => {
      if (val === 'biometric_success') {
        const cred = await this.storageService.getCredentialFromStorage();
        this.login(cred);
      }
    }).catch(err => {
      this.toastService.showToast('Please try again')
    })
  }

  testCand1() {
    this.form.get('phone').setValue('1111111111');
    this.form.get('password').setValue('11111111');
    this.login();
  }

  testCand2() {
    this.form.get('phone').setValue('1111111140');
    this.form.get('password').setValue('11111111');
    this.login();
  }

  testComp1() {
    this.form.get('phone').setValue('1111111116');
    this.form.get('password').setValue('11111111');
    this.login();
  }

  testComp2() {
    this.form.get('phone').setValue('1111111139');
    this.form.get('password').setValue('11111111');
    this.login();
  }

  eye(event) {
    event.stopPropagation();
    this.isShowPassword = !this.isShowPassword;
  }

  ionViewDidLeave(): void {
    this.menuController.enable(true);
   }

  ionViewDidEnter(): void {
    this.menuController.enable(false);
  }


}
