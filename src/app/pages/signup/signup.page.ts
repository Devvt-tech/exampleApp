import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { IRegisterRequest, IRegisterResponse } from 'src/app/interfaces/auth.interface';
import { IGenericCommonResponse } from 'src/app/interfaces/common.interface';
import { AuthService } from 'src/app/services/auth.service';
import { CommonService } from 'src/app/services/common.service';
import { DataService } from 'src/app/services/data.service';
import { FIELD_IS_REQUIRED } from 'src/constants';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.page.html',
  styleUrls: ['./signup.page.scss'],
})
export class SignupPage implements OnInit {

  public form: FormGroup;
  public fieldIsRequired = FIELD_IS_REQUIRED;
  public serverErrorText: string;
  public response: IGenericCommonResponse<IRegisterResponse>;
  public showServerError: boolean;

  constructor(
    private authService: AuthService,
    public commonService: CommonService,
    private router: Router,
    private ds: DataService
  ) { }

  ngOnInit() {
    this.form = this.buildForm();
  }

  private buildForm() {
    return new FormGroup({
      role_id: new FormControl(null, [Validators.required]),
      phone: new FormControl('', [Validators.required]),
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required]),
      password_confirmation: new FormControl('', [Validators.required]),
      name: new FormControl('', [Validators.required]),
    })
  }

  public async registerClick() {
    let model: IRegisterRequest = this.form.value;
    Object.assign<IRegisterRequest, any>(model, this.form.value);
    model.device_token = this.ds.deviceToken;
    this.response = await this.authService.register(model);
    this.showServerError = !!this.response?.errors;
    if (!this.response?.errors) {
      this.router.navigate(['/profile-form'], {replaceUrl: true})
    }
  }

}
