import { Component, Input, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Params } from '@angular/router';
import { MenuController, ModalController, NavController } from '@ionic/angular';
import { ICertificate } from 'src/app/interfaces/certificate.interfaces';
import { CertificatesService } from 'src/app/services/certificates.service';
import { ToastService } from 'src/app/services/toast.service';

@Component({
  selector: 'app-certificates-upload',
  templateUrl: './certificates-upload.page.html',
  styleUrls: ['./certificates-upload.page.scss'],
})
export class CertificatesUploadPage implements OnInit {

  form: FormGroup;
  formArray: FormArray;
  formData = new FormData();
  @Input() type: string;
  @Input() readOnly: boolean;

  constructor(
    private certificatesService: CertificatesService,
    private actRoute: ActivatedRoute,
    private navController: NavController,
    private toastService: ToastService,
    private modalController: ModalController
  ) {
  }

  ngOnInit() {
    this.form = this.buildForm();
    this.formArray = this.form.get('array') as FormArray;
  }

  async ionViewWillEnter() {
    const certificatesResponse = await this.certificatesService.loadCertificates(this.type);
    if (certificatesResponse?.length === 0) {
      this.formArray.push(this.type === 'resume' ? this.newFormResumeItem() : this.newFormItem())
    } else {
      certificatesResponse.forEach(val => {
        this.formArray.push(this.type === 'resume' ? this.newFormResumeItem(val) : this.newFormItem(val))
      })
    }
  }

  buildForm() {
    return new FormGroup({
      array: new FormArray([])
    })
  }

  newFormItem(item?: ICertificate) {
    return new FormGroup({
        img: new FormControl(item?.img || '', [Validators.required]),
        name_id: new FormControl(item?.name_id || '', [Validators.required]),
        id: new FormControl(item?.id || '')
      }
    )
  }

  newFormResumeItem(item?: ICertificate) {
    return new FormGroup({
        img: new FormControl(item?.img || '', [Validators.required]),
        name: new FormControl(item?.name || 'resume'),
        id: new FormControl(item?.id || '')
      }
    )
  }

  addItem() {
    this.formArray.push(this.type === 'resume' ? this.newFormResumeItem() : this.newFormItem())
  }

  remItem(index: number) {
    this.formArray.removeAt(index)
  }

  async save() {
    const formD = new FormData();
    this.form.get('array').value.forEach((v, i) => {
      formD.set(`${this.type}[${i}][img]`, v.img)
      formD.set(`${this.type}[${i}][${this.type === 'resume' ? 'name' : 'name_id'}]`, v.name_id || v.name)
    })
    const saveCertificatesResponse = await this.certificatesService.saveCertificates(formD, this.type);
    if (saveCertificatesResponse === 'success' || saveCertificatesResponse['success'] === 'success') {
      this.toastService.showSuccessToast();
      this.modalController.dismiss();
    }
  }

  dismiss() {
    this.modalController.dismiss()
  }

}
