import { Subscriber } from 'rxjs/Subscriber';
import { NotificationProvider } from '../../providers/notification/notification';
import { MyWishlistPage } from '../my-wishlist/my-wishlist';
import { MyOrdersPage } from '../my-orders/my-orders';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Events } from 'ionic-angular';
import { AccountInfoPage } from '../account-info/account-info';
import { MyAddressesPage } from '../my-addresses/my-addresses';

/**
 * Generated class for the MyAccountPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-my-account',
  templateUrl: 'my-account.html',
  providers : [NotificationProvider]
})
export class MyAccountPage {
  username  ;
  email     ;
  constructor(public navCtrl: NavController ,
              public navParams: NavParams ,
              public event : Events ,
              private _notificationService : NotificationProvider) {
    this.username = localStorage.getItem("firstName") + " " +localStorage.getItem("lastName");
    this.email = localStorage.getItem("email");

    console.log(this.username)
  }


  GoToMyOrders = () => {
    this.navCtrl.push("MyOrdersPage",{animate: false});
  }

  GoToMywishlist = () => {
    this.navCtrl.push("MyWishlistPage",{animate: false});
  }

  GoToMyAddresses = () => {
    this.navCtrl.push("MyAddressesPage",{animate: false});
  }

  GoToAccountInfo = () => {
    this.navCtrl.push("AccountInfoPage",{animate: false});
  }

  logout = () =>{ 
    this._notificationService.delete_user_token(localStorage.getItem('userid')).subscribe((res)=>{
      console.log(res)
    });
    this.navCtrl.setRoot("WelcomePage");
    let currentLang = localStorage.getItem('lang');
    let currentCurrency = localStorage.getItem('currency');
    let currentCurrencyRate = localStorage.getItem('currencyRate');

    localStorage.clear();
    
    localStorage.setItem('lang',currentLang)
    localStorage.setItem('currency',currentCurrency)
    localStorage.setItem('currencyRate',currentCurrencyRate)

    this.event.publish("logout");
  }


  back = () => {
    this.navCtrl.pop({animate:false});
  }
}
