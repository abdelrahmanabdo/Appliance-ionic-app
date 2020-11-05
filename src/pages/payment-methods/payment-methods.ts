import { Subscriber } from 'rxjs/Subscriber';
import { PayFortServiceProvider } from '../../providers/pay-fort-service/pay-fort-service';
import { SuccessfulPaymentPage } from '../successful-payment/successful-payment';
import { CheckoutPage } from '../checkout/checkout';
import { PaytabsServiceProvider } from '../../providers/paytabs-service/paytabs-service';
import { CheckoutProvider } from '../../providers/checkout/checkout';
import { PayTabsPage } from '../pay-tabs/pay-tabs';
import { Component } from '@angular/core';
import { IonicPage,ModalController ,NavController, NavParams, LoadingController } from 'ionic-angular';
import { InAppBrowser, InAppBrowserOptions } from '@ionic-native/in-app-browser';
import CryptoJS from 'crypto-js';


/**
 * Generated class for the PaymentMethodsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-payment-methods',
  templateUrl: 'payment-methods.html',
  providers : [CheckoutProvider , PaytabsServiceProvider , PayFortServiceProvider]
})
export class PaymentMethodsPage {
   userShippingData : any ;
   paymentMethods ;
   billing_address ;
   shipping_address;
   shipping_method ;
   selectedPaymentMethod;
   options: InAppBrowserOptions = {
    location: 'yes',
    hidden: 'no',
    clearcache: 'yes',
    clearsessioncache: 'yes',
    zoom: 'yes',
    hardwareback: 'yes',
    mediaPlaybackRequiresUserAction: 'no',
    shouldPauseOnSuspend: 'no',
    closebuttoncaption: 'Close',
    disallowoverscroll: 'no',
    toolbar: 'yes',
    enableViewportScale: 'no',
    allowInlineMediaPlayback: 'no',
    presentationstyle: 'pagesheet',
    fullscreen: 'yes',
  };
  dataAvaliable = false;
  
  constructor(public navCtrl: NavController , 
              public navParams: NavParams ,
              public modalCtrl : ModalController,
              private _checkoutService : CheckoutProvider ,
              private _paytabsService  : PaytabsServiceProvider,
              private _payfortService  : PayFortServiceProvider,
              public inApp : InAppBrowser  ,
              public loading : LoadingController) {
                this.billing_address = this.navParams.get("billing_address");
                this.shipping_address = this.navParams.get("shipping_address");
                this.shipping_method = this.navParams.get("shipping_method");
                if(localStorage.getItem('LoginSession')){
                  this._checkoutService.get_payment_methods().subscribe((methods)=>{
                    this.paymentMethods = methods;
                    this.dataAvaliable = true ;
                  });
                }else{
                  this._checkoutService.get_guest_payment_methods().subscribe((methods)=>{
                    this.paymentMethods = methods;
                    this.dataAvaliable = true ;
                  })
                }

    
  }

  continue_to_payment = () => {
    this.dataAvaliable = false ;
      if(this.selectedPaymentMethod == "paytabsexpress"){
          this.paytabsPayment();
      }else if(this.selectedPaymentMethod == "payfort_fort_cc") {
        this.payFortPayment();
      }

      if(localStorage.getItem('LoginSession')){
        this._checkoutService.prepareForCheckout(this.shipping_address,this.billing_address , this.shipping_method).subscribe((res)=>{
          this._checkoutService.create_an_order(this.shipping_address,this.billing_address,this.selectedPaymentMethod).subscribe((res)=>{
            console.log(res)
            if(res){
              this.navCtrl.push("SuccessfulPaymentPage",{ status : 1  , orderNumber : res },{animate: false});
              this.dataAvaliable = true ;
            }
          },   
          error => this.dataAvaliable = true);
          console.log(res)
        },   
        error => this.dataAvaliable = true);
      }else{
        this._checkoutService.guestPrepareForCheckout(this.shipping_address , this.shipping_method).subscribe((res)=>{
          this._checkoutService.guest_create_an_order(this.shipping_address,this.selectedPaymentMethod).subscribe((res)=>{
            console.log(res)
            if(res){
              this.navCtrl.push("SuccessfulPaymentPage",{status :1 , orderNumber : res });
              this.dataAvaliable = true ;
            }
          },   
          error => this.dataAvaliable = true);
          console.log(res)
        },   
        error => this.dataAvaliable = true);
      }



  }

  paytabsPayment = () => {
    this._paytabsService.validate_secret_key().subscribe( (res)=> {
      if(res.response_code === "4000" && res.result === "valid") {
        this._checkoutService.get_payment_inforamtion().subscribe(info => {
          console.log('info',info)
          let items = "";
          let unit_price = "";
          let qty =  ""; 
          let amount =  0; 
          
          info.items.forEach(element => {
              items += element.name + ' || ' ;
              unit_price += element.price + ' || ';
              qty += element.qty + ' || ';
              amount += (element.qty * element.price) ;
          });
          items = items.substr(0,items.length-3);
          unit_price = unit_price.substr(0,unit_price.length-3);
          qty = qty.substr(0,qty.length-3);
        
          this.userShippingData = {
            title           : info.billing_address.firstname ? info.billing_address.firstname  : info.customer.firstname + info.billing_address.lastname ? info.billing_address.lastname : info.customer.lastname ,
            cc_first_name   : info.billing_address.firstname ? info.billing_address.firstname  : info.customer.firstname ,          
            cc_last_name    : info.billing_address.lastname ? info.billing_address.lastname : info.customer.lastname  ,
            cc_phone_number : info.billing_address.telephone ?info.billing_address.telephone : info.customer.addresses[0].telephone ,
            phone_number    : info.billing_address.telephone ?info.billing_address.telephone : info.customer.addresses[0].telephone , 
            email           : info.billing_address.email , 
            products_per_title  : items , 
            unit_price      : unit_price ,
            quantity             : qty ,
            other_charges    : 100,
            amount          : amount + 100 , 
            currency        : info.currency.store_currency_code ,
            ip_customer     : "192.168.0.90",
            
            // dummy 
            billing_address : "Flat 3021 Manama Bahrain" ,
            state           : "Manama" ,
            city            : "Manama"  ,
            postal_code     : "00973"   ,
            country         : "BHR"     ,
            address_shipping :"Flat 3021 Manama Bahrain" ,
            city_shipping    :"Manama" ,
            state_shipping   : "Manama" ,
            postal_code_shipping : "1234",
            country_shipping : "BHR" , 
            reference_no      : "aaaaaaa", 
          }

          this._paytabsService.create_pay_page(this.userShippingData).subscribe((createPageResult) => {
            console.log(createPageResult);
            if(createPageResult.response_code === "4012" && createPageResult.result === "The Pay Page is created."){
              const browser = this.inApp.create(createPageResult.payment_url , '_blank', this.options);
              browser.on("loadstart").subscribe((res)=>{
                console.log(res.url); 
                if(res.url === "http://road9.space/appliance/index.php") {
                  this._paytabsService.verify_payment(createPageResult.p_id).subscribe((paymentResult)=>{
                    browser.close()

                    if(paymentResult.response_code === "100" && paymentResult.result === "The payment is completed successfully!")
                    {
                      this.navCtrl.push("SuccessfulPaymentPage" , { status : 1},{animate: false});
                    }
                    else {
                      this.navCtrl.push("SuccessfulPaymentPage" , {status : 0},{animate: false});

                    }
                  })
                }
              })
            };
          })

        })
      }


    } 
  )
    // this.navCtrl.push("PayTabsPage");
  }

  payFortPayment = () => {
      let modal = this.modalCtrl.create("PayfortPaymentPage");
      modal.present();

  }

  back = () =>{
    this.navCtrl.pop({animate:false});
  }
}
