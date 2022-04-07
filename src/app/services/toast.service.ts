import { Injectable } from '@angular/core';
import { ToastController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class ToastService {

  constructor(
    private toastController: ToastController
  ) { }

  public async show(message: string, duration = 10000) {
    alert(message);
  }

  async showToast(message: string, duration = 5000) {
    const toast = await this.toastController.create({
      message: message,
      duration: duration,
      position: 'bottom'
    });
    toast.present();
  }

  async showSuccessToast(duration = 5000) {
    const toast = await this.toastController.create({
      message: 'Success',
      duration: duration,
      position: 'bottom'
    });
    toast.present();
  }

}
