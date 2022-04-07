import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ICertificate } from '../interfaces/certificate.interfaces';
import { CertificatesService } from './certificates.service';

@Injectable({
  providedIn: 'root'
})

export class ResumeResolverService implements Resolve<string> {

  private baseUrl = environment.baseUrl;

  constructor(
    private certificatesService: CertificatesService,
  ) { }

  async resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<string> {
    const resumes = await this.certificatesService.loadCertificates('resume');
    let result = '';
    if (resumes.length > 0) {
      const img = resumes[0].img as string;
      result = this.baseUrl + 'public/storage/' + 'resume' + '/' + img?.split('/')[2];
    }
    return result

    
  }
}
