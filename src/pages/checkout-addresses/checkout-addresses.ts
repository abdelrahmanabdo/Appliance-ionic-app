import { AuthProvider } from '../../providers/auth/auth';
import { UserProvider } from '../../providers/user/user';
import { CheckoutProvider } from '../../providers/checkout/checkout';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController } from 'ionic-angular';

/**
 * Generated class for the CheckoutAddressesPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-checkout-addresses',
  templateUrl: 'checkout-addresses.html',
  providers : [AuthProvider , UserProvider , CheckoutProvider]

})
export class CheckoutAddressesPage {
  userAdresses;
  selectedAddress;
  change_address_callbackFunc;
  billingAddressId ;
  dataAvaliable = false;
  constructor(public navCtrl: NavController, 
              public navParams: NavParams , 
              private _authService : AuthProvider, 
              private _userService: UserProvider,
              private _checkoutService : CheckoutProvider,
              public loading : LoadingController) {
                this.change_address_callbackFunc = this.navParams.get("callback");
                this.billingAddressId = this.navParams.get("billingAddressId");
               this._authService.getLoggedInUserData(localStorage.getItem('Token')).subscribe((addresses)=> {
               console.log(addresses)
               if(addresses.addresses) {
                 this.userAdresses = addresses.addresses;
                 this.dataAvaliable = true ;
               }
          
              });
              }


  submitAddress = () => {
      if(this.selectedAddress.region){
        this.selectedAddress.region_code = this.selectedAddress.region.region_code;
        this.selectedAddress.region_id = this.selectedAddress.region.region_id;
        this.selectedAddress.region = this.selectedAddress.region.region;
      }
      delete this.selectedAddress.default_billing;
      delete this.selectedAddress.id;
      console.log(this.selectedAddress)
      this._checkoutService.set_billing_address(this.selectedAddress).subscribe(res=> {
        res ? this.change_address_callbackFunc(this.selectedAddress).then(()=>{
          this.navCtrl.pop({animate:false})
        }) : ""
      })

  }


  back = () => {
    this.navCtrl.pop({animate:false});
  }

}
