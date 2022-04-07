import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { CERTIFICATE_TYPE } from 'src/constants';
import { environment } from 'src/environments/environment';
import { ICertificate } from '../interfaces/certificate.interfaces';
import { ApiService } from './api.service';
import { ToastService } from './toast.service';

@Injectable({
  providedIn: 'root'
})
export class CertificatesService implements Resolve<ICertificate[]> {
  
  private baseUrl = environment.baseUrl;
  certificateTypes = CERTIFICATE_TYPE;

  constructor(
    private apiService: ApiService,
    private toastService: ToastService,
  ) { }

  async resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<ICertificate[]> {
    const certificates = await this.loadCertificates('certificate');
    certificates.forEach((v) => {
      v.name = this.getCertificateNameByIndex(v.name_id);
      v.img = this.checkFileType(v.img as string, true);
      const split = v.img?.split('.');
      const ext = split[split.length - 1];
      if (['jpg', 'jpeg', 'png'].includes(ext.toLocaleLowerCase())) {
        v.img = this.baseUrl + 'public/storage/' + 'certificate' + '/' + v.img?.split('/')[2];
      }
    })
    return certificates
  }

  loadCertificates(type: string) {
    const result: ICertificate[] = [];
    return this.apiService.getCertificates(type).then(val => {
      return val;
    }).catch(err => {
      return result
    })
  }

  saveCertificates(request: FormData, type: string) {
    const result: ICertificate[] = [];
    return this.apiService.saveCertificates(request, type).then(val => {
      return val;
    }).catch(err => {
      return result
    })
  }

  deleteCertificate(id: string, type: string) {
    return this.apiService.deleteCertificate(id, type).then(val => {
      return val;
    }).catch(err => {
      return 'error'
    })
  }

  getCertificateNameByIndex(index: number) {
    return this.certificateTypes[index - 1];
  }

  checkFileType(val: string, fileUploaded: boolean) {
    let result: string;
    const split = val.split('.');
    const ext = split[split.length - 1];
    if (['jpg', 'jpeg', 'png'].includes(ext.toLocaleLowerCase())) {
      fileUploaded = true;
      result = val;
    } else if (['doc', 'docx'].includes(ext.toLowerCase())) {
      fileUploaded = true;
      result = './assets/img/doc.svg'
    } else if (ext.toLowerCase() === 'pdf') {
      fileUploaded = true;
      result = './assets/img/pdf.svg'
    } else {
      this.toastService.showToast('Format is not supported');
      fileUploaded = false;
      result = './assets/img/pdf.svg'
    }
    return result
  }

}
