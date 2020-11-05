import { TabsPage } from '../tabs/tabs';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Events } from 'ionic-angular';
import { OrdersProvider } from '../../providers/orders/orders';

/**
 * Generated class for the SuccessfulPaymentPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-successful-payment',
  templateUrl: 'successful-payment.html',
})
export class SuccessfulPaymentPage {
  paymentStatus  ;
  paymentResult = ""  ;
  orderNumber  ; 
  orderDetails ;
  constructor(public navCtrl: NavController, 
              public navParams: NavParams ,
              public event : Events,
              private orderService : OrdersProvider) {
    this.paymentStatus = this.navParams.get('status');
    this.orderNumber   = this.navParams.get('orderNumber');
    

    if(this.paymentStatus == 1) {
      this.orderService.getOrderDetails(this.orderNumber).subscribe((order)=>{
        this.orderDetails = order ;
        console.log(order)
      });
      if(localStorage.getItem('LoginSession')){
         this.event.publish('cartCount' , 'emptyCart');
      }else {
        let currentLang = localStorage.getItem('lang');
        let currentCurrency = localStorage.getItem('currency');
        let currentCurrencyRate = localStorage.getItem('currencyRate');
    
        localStorage.clear();
        
        localStorage.setItem('lang',currentLang)
        localStorage.setItem('currency',currentCurrency)
        localStorage.setItem('currencyRate',currentCurrencyRate)     
       }
      this.paymentResult = "payment Successfully"

    }else {
      this.paymentResult = "Failed "
    }
  }


  continueShopping = () => {
    this.navCtrl.push("TabsPage",{animate: false});
  }
  
  navigateToOrders  = () => {
    this.navCtrl.push('MyOrdersPage',{animate: false});
  }

  get isLoggedIn () {
    return localStorage.getItem('LoginSession');
  }
}
