import { Injectable } from '@angular/core';
import { LoadingController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class LoadingService {

  private isLoading = false;
  

  constructor(
    private loadingController: LoadingController,
  ) { }

  
  public async showLoader(langKey: string = 'common.defaultLoader') {

    this.isLoading = true;
    return await this.loadingController
      .create({
        message: 'Loading...',
        spinner: 'crescent',
        duration: 20000
      })
      .then(a => {
        a.present().then(() => {
          if (!this.isLoading) {
            a.dismiss().then(() => {});
          }
        });
      });
  }

  public async hideLoader() {
    this.isLoading = false;
    return await this.loadingController
      .dismiss()
      .then(() => {});
  }
}
