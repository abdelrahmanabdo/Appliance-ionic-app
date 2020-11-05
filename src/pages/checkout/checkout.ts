import { CartProvider } from '../../providers/cart/cart';
import { AuthProvider } from '../../providers/auth/auth';
import { UserProvider } from '../../providers/user/user';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, ModalController, ToastController } from 'ionic-angular';
import {CheckoutProvider} from '../../providers/checkout/checkout';
import { Validators, FormBuilder, FormGroup, FormControl } from '@angular/forms';

/**
 * Generated class for the CheckoutPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-checkout',
  templateUrl: 'checkout.html',
  providers : [CheckoutProvider,UserProvider ,AuthProvider,CartProvider]
})
export class CheckoutPage {
  totals;
  dataAvaliable ;
  countries;
  setShippingAddressForm : FormGroup;
  showShipping = true;
  shippingMethods = null  ;
  user = {
    firstname   : '' ,
    lastname    : '' ,
    country_id  : '' ,    
    company     : '' ,
    street      : [] ,
    city        : '' ,
    postcode    : '' ,
    email       : '' ,
    telephone   : '' , 
    region_id   : 0   
  };
  is_logged ;
  // after delete from  object default_billing , default_shipping 
  //, region from object this reflected on the object  so i created this var
  sentDataToGetShippingMethods ;
  userAddresses = [] ;
  couponValue
  showCheckout;
  showItems;
  items;
  cartId;
  defaultBillingAddress ;
  defaultShippingAddress ;
  selectedShippingMethod ;
  selectedAddress;
  server_base_image_url;    
  constructor(public navCtrl: NavController,
              public loading : LoadingController, 
              public checkoutProvider : CheckoutProvider,
              public navParams: NavParams,
              private _authService : AuthProvider,
              private _userService: UserProvider,
              private modal : ModalController,
              private _cartService : CartProvider,
              public formBuilder: FormBuilder,
              private toast :ToastController) {
              this.server_base_image_url  = "https://app-liance.com/pub/media/catalog/product";
              this.dataAvaliable = false ;
              this.is_logged = localStorage.getItem("LoginSession");
              if(this.is_logged) {  
                this._authService.getLoggedInUserData(localStorage.getItem('Token')).subscribe((user)=> {
                  if(user.addresses.length > 1) {
                    this.userAddresses=user.addresses;
                    console.log(this.userAddresses)
                    this.userAddresses.forEach(element => {
                      console.log(element)
                      if('default_billing' in element){
                        this.defaultBillingAddress = element;
                      }else if('default_shipping' in element){
                        this.defaultShippingAddress = element ;
                        this.defaultBillingAddress  = element ;
                        this.get_shipping_methods(this.defaultShippingAddress);
                        this.selectedAddress = element;
                      }

                    });
                  }else if (user.addresses.length === 1){
                    console.log(user.addresses)
                    this.userAddresses.push(user.addresses[0]);
                    console.log(this.userAddresses)
                    this.defaultBillingAddress = this.defaultShippingAddress =  user.addresses[0];
                    this.sentDataToGetShippingMethods = this.defaultShippingAddress;
                    this.get_shipping_methods(this.sentDataToGetShippingMethods);
                  }
                },   
                error => this.dataAvaliable = true);
              this.dataAvaliable = true ;
              this.get_user_cart();
              }else {
                this.dataAvaliable = true ;
                this.checkoutProvider.get_countries_regions().subscribe((res) => {
                  this.countries = res;
                  console.log(this.countries);
                },   
                error => this.dataAvaliable = true);
                this.get_guest_cart();
              }
  }

  ngOnInit() : void {
    this.setShippingAddressForm = this.formBuilder.group({
      guestFirstName: new FormControl('', Validators.compose([
        Validators.required,
      ])),
      guestLastName: new FormControl('', Validators.compose([
        Validators.required,
      ])),
      guestEmail: new FormControl('', Validators.compose([
        Validators.required,
        Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')
      ])),
      guestCountry: new FormControl('', Validators.compose([
        Validators.required,
      ])),
      guestPostCode: new FormControl('', Validators.compose([
        Validators.required,
      ])),
      guestCity: new FormControl('', Validators.compose([
        Validators.required,
      ])),
      guestCompany: new FormControl('', Validators.compose([
      ])),
      guestPhoneNumber: new FormControl('', Validators.compose([
        Validators.required,
      ])),
      guestStreet: new FormControl('', Validators.compose([
        Validators.required,
      ])),
    });

  }

  validation_messages = {
    'guestFirstName': [
      { type: 'required', message: 'First name is required.'},
    ],
    'guestLastName': [
      { type: 'required', message: 'Last name is required.'},
    ],
    'guestEmail': [
      { type: 'required', message: 'Email is required.'},
      { type: 'pattern', message: 'Please insert right formate.' }    

    ],
    'guestCountry': [
      { type: 'required', message: 'Country is required.' },
    ],
    'guestCity': [
      { type: 'required', message: 'City is required.' }
    ],
    'guestStreet': [
      { type: 'required', message: 'Street is required.'},
    ],
    'guestPhoneNumber': [
      { type: 'required', message: 'Phone number is required.'},
    ],
    'guestPostCode': [
      { type: 'required', message: 'Post code is required.'},
    ],

  
  };

  get_shipping_methods (userAddresses = this.user) {
    this.dataAvaliable = false ;
    if(this.is_logged){
      this.checkoutProvider.get_shipping_method(userAddresses).subscribe(res=>{
        this.showShipping = false ;
        this.shippingMethods = res;
        this.dataAvaliable = true ;
      },   
      error => this.dataAvaliable = true);      
    }else {
      this.checkoutProvider.get_guest_shipping_method(this.user).subscribe(res=>{
        this.showShipping = false ;
        this.shippingMethods = res;
        this.dataAvaliable = true ;
      },   
      error => this.dataAvaliable = true);
    }
  }


  addAddress = () => {
    let addModal =this.modal.create("AddAddressesPage",{
      "otherAddresses" : this.userAddresses ? this.userAddresses : []
    });
    addModal.present();
  }  

  get_user_cart = () => {
     this._cartService.get_user_cart().subscribe(res=>{
      this._cartService.get_cart_totals().subscribe((total) => {
        console.log(total)
        this.totals =total;
        this.items = res.items;
        this.cartId = res.id;
        if(this.items.length){
          this.showItems = false;
          this.showCheckout = false;
        }else {
          this.showItems = true ;
        }
      },   
      error => this.dataAvaliable = true);
    },   
    error => this.dataAvaliable = true);
  }

  get_guest_cart = () => {
    this._cartService.get_guest_cart().subscribe(res=>{
      this._cartService.get_guest_cart_totals().subscribe((total) => {
        console.log(total)
        this.totals =total;
        this.items = res.items;
        this.cartId = res.id;
        if(this.items.length){
          this.showItems = false;
          this.showCheckout = false;
        }else {
          this.showItems = true ;
        }
      });
    })
  }


  payment_methods() {
      let shipping_address = this.is_logged ?  this.selectedAddress  : this.user ;
      let billing_address = this.is_logged ?  this.defaultBillingAddress : this.user;
      if(localStorage.getItem('LoginSession')){
        this.checkoutProvider.set_shipping_address(shipping_address , this.selectedShippingMethod.method_code,this.selectedShippingMethod.carrier_code)
        .subscribe((result)=>{
          console.log(result)
        },   
        error => this.dataAvaliable = true);
      }
      this.navCtrl.push("PaymentMethodsPage",{
        shipping_address ,
        billing_address  ,
        shipping_method : this.selectedShippingMethod
      },{animate: false});
  }

  setShippingAddress = ( address) => {  
    this.dataAvaliable = false ;
    this.selectedAddress = address
    this.checkoutProvider.set_billing_address(address).subscribe(res=> {
      address.id = res
      this.dataAvaliable = true ;
      this.get_shipping_methods(address);
    },   
    error => this.dataAvaliable = true);
  }

  apply_coupon = () => {
    if(this.couponValue != "") {
      this.dataAvaliable = false;
      if(this.is_logged){
        this._cartService.apply_discount_coupon(this.cartId,this.couponValue).subscribe((res)=> {
          console.log(res)
          if(res === true) {
            this.get_user_cart();
            let toast =  this.toast.create({
                message:"Coupon applied successfully",
                duration:2500,
                position : 'top', 
                cssClass : 'toast'
              });
              toast.present();
              this.dataAvaliable = true ;
            }
        },(err)=>{
          if(err.status === 404){
            this.dataAvaliable = true ;
            let toast =  this.toast.create({
              message:err.error.message,
              duration:2500,
              position : 'top', 
              cssClass : 'toast'
            });
            toast.present();
          }
        });
      }else {
        this._cartService.guest_apply_discount_coupon(this.couponValue).subscribe((res)=> {
          console.log(res)
          if(res === true) {
            this.get_guest_cart();
            let toast =  this.toast.create({
                message:"Coupon applied successfully",
                duration:2500,
                position : 'top', 
                cssClass : 'toast'
              });
              toast.present();
              this.dataAvaliable = true ;
            }
        },(err)=>{
          if(err.status === 404){
            this.dataAvaliable = true;
            let toast =  this.toast.create({
              message:err.error.message,
              duration:2500,
              position : 'top', 
              cssClass : 'toast'
            });
            toast.present();
          }
        });
      }

    }
  }

  get currency(): any {
    return localStorage.getItem('currency');
  }
  
  get currencyRate(): any {
    return localStorage.getItem('currencyRate');
  }

  addNewAddress = () => {
    this.navCtrl.push('AddAddressesPage',{animate: false})
  }
  
  back = () => {
    this.navCtrl.pop({animate:false});
  }
}
