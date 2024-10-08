import { Injectable } from '@angular/core';
import { AlertButton, AlertController, AlertInput, LoadingController, ModalController, ModalOptions, ToastController } from '@ionic/angular';
import { ComponentRef } from '@ionic/core';

@Injectable({
  providedIn: 'root'
})
export class GlobalService {

  isLoading: boolean = false;

  constructor(
    private alertCtrl: AlertController,
    private toastCtrl: ToastController,
    private loadingCtrl: LoadingController,
    private modalCtrl: ModalController
  ) { }


  setLoader() {
    this.isLoading = !this.isLoading;
  }

  showAlert(message: string, header?: string | undefined, buttonArray?: (string | AlertButton)[] | undefined, inputs?: AlertInput[] | undefined) {
    this.alertCtrl.create({
      header: header ? header : 'Authentication failed',
      message: message,
      inputs: inputs ? inputs : [],
      buttons: buttonArray ? buttonArray : ['Okay']
    })
    .then(alertEl => alertEl.present());
  }

  async showToast(msg: any, color: any, position: any, duration = 3000) {
    const toast = await this.toastCtrl.create({
      message: msg,
      duration: duration,
      color: color,
      position: position
    });
    toast.present();
  }

  errorToast(msg?: any, duration = 4000) {
    this.showToast(msg ? msg : 'No Internet Connection', 'danger', 'bottom', duration);
  }

  successToast(msg: any) {
    this.showToast(msg, 'success', 'bottom');
  }

  showLoader(msg?: any, spinner?: string | null | undefined) {
    // this.isLoading = true;
    if(!this.isLoading) this.setLoader();
    return this.loadingCtrl.create({
      message: msg,
      spinner: spinner ? spinner : 'bubbles'
    }).then(res => {
      res.present().then(() => {
        if(!this.isLoading) {
          res.dismiss().then(() => {
            console.log('abort presenting');
          });
        }
      })
    })
    .catch(e => {
      console.log('show loading error: ', e);
    });
  }

  hideLoader() {
    // this.isLoading = false;
    if(this.isLoading) this.setLoader();
    return this.loadingCtrl.dismiss()
    .then(() => console.log('dismissed'))
    .catch(e => console.log('error hide loader: ', e));
  }

  async createModal(options: ModalOptions<ComponentRef>) {
    const modal = await this.modalCtrl.create(options);
    await modal.present();
    const { data } = await modal.onWillDismiss();
    console.log(data);
    if(data) return data;
  }

  modalDismiss(val?: any) {
    let data: any = val ? val : null;
    console.log('data', data);
    this.modalCtrl.dismiss(data);
  }

  getIcon(title: string) {
    const name = title.toLowerCase();
    switch(name) {
      case 'home': return 'home-outline';
      case 'work': return 'briefcase-outline';
      default: return 'location-outline';
    }
  }
  
}
