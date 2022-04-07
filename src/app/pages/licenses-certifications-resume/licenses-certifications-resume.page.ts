import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { ICertificate } from 'src/app/interfaces/certificate.interfaces';
import { CertificatesUploadPage } from '../candidate/certificates-upload/certificates-upload.page';

@Component({
  selector: 'app-licenses-certifications-resume',
  templateUrl: './licenses-certifications-resume.page.html',
  styleUrls: ['./licenses-certifications-resume.page.scss'],
})
export class LicensesCertificationsResumePage implements OnInit {

  allCertificates: boolean;
  resumePath: string;
  certificates: ICertificate[];

  constructor(
    public modalController: ModalController,
    private actRoute: ActivatedRoute,
  ) {
    actRoute.data.subscribe(data => {
      this.resumePath = data.resumePath;
      this.certificates = data.certificates
    })
  }

  ngOnInit() {
  }

  async toCertificates(type: string) {
    const modal = await this.modalController.create({
      component: CertificatesUploadPage,
      componentProps: {
        type: type,
        readOnly: true
      }
    });
    modal.present();
  }

}
