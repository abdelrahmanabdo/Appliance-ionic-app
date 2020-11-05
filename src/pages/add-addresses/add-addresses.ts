import { CheckoutProvider } from '../../providers/checkout/checkout';
import { UserProvider } from '../../providers/user/user';
import { MyAddressesPage } from '../my-addresses/my-addresses';
import { Component, NgZone } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, Events } from 'ionic-angular';
import { Validators, FormBuilder, FormGroup, FormControl } from '@angular/forms';
/**
 * Generated class for the AddAddressesPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-add-addresses',
  templateUrl: 'add-addresses.html',
  providers : [UserProvider ,CheckoutProvider]

})
export class AddAddressesPage {
  addressAddForm : FormGroup;
  otherAddresses;
  countryId;
  countries;
  defaultShipping = false;
  defaultBilling = false;
  dataAvaliable = true;
  constructor(public navCtrl: NavController, 
    public navParams: NavParams,
    public formBuilder: FormBuilder,
    public _userService : UserProvider,
    public toast    : ToastController,
    public zone : NgZone,
    public event : Events,  
    private _checkoutService : CheckoutProvider,

  ) {
      this._checkoutService.get_countries_regions().subscribe((countries)=> {
        console.log(countries)
        this.countries = countries;
       });
      this.otherAddresses = this.navParams.get("otherAddresses") ? 
                                                                 this.navParams.get("otherAddresses")
                                                                 : [] ;
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AddAddressesPage');
  }

  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this.addressAddForm = this.formBuilder.group({
      street: new FormControl('', Validators.compose([
        Validators.required,
      ])),
      city: new FormControl('', Validators.compose([
        Validators.required,
      ])),
      region: new FormControl('', Validators.compose([
        Validators.required,
      ])),
      countryId: new FormControl('', Validators.compose([
        Validators.required,
      ])),
      telephone: new FormControl('', Validators.compose([
        Validators.required,
      ])),
      postcode: new FormControl('', Validators.compose([
        Validators.required,
      ])),
      defaultBilling: new FormControl('false', Validators.compose([
      ])),
      defaultShipping: new FormControl('false', Validators.compose([
      ])),
  
    });



  }

  edit_validation_messages = {
    'street': [
      { type: 'required', message: 'street is required.'},
    ],
    'city': [
      { type: 'required', message: 'city is required.'},
    ],
    'region': [
      { type: 'required', message: 'region is required.'},
    ],
    'countryId': [
      { type: 'required', message: 'countryId is required.'},
    ],
    'telephone': [
      { type: 'required', message: 'Telephone is required.'},
    ],
    'postcode': [
      { type: 'required', message: 'postcode is required.'},
    ],
  
    
  };

  addAddress = (values) => {
    this.dataAvaliable = false ;
    console.log(this.defaultBilling)
    console.log(this.defaultShipping)
    console.log(values);
    this._userService.add_user_address(this.otherAddresses ,values).subscribe((res)=> {
      if(res) {
        if(values.defaultBilling && values.defaultShipping) {
          this._userService.set_default_shipping_address(res.addresses[res.addresses.length - 1 ].id).subscribe((res)=>{console.log(res)
            this._userService.set_default_billing_address(res.addresses[res.addresses.length - 1 ].id).subscribe((res)=>{console.log(res)
              res.addresses[res.addresses.length - 1 ].region_code =res.addresses[res.addresses.length - 1 ].region.region_code; 
              res.addresses[res.addresses.length - 1 ].region_id =res.addresses[res.addresses.length - 1 ].region.region_id; 
              res.addresses[res.addresses.length - 1 ].region_swap =res.addresses[res.addresses.length - 1 ].region.region; 
              delete res.addresses[res.addresses.length - 1 ].region;
              res.addresses[res.addresses.length - 1 ].region = res.addresses[res.addresses.length - 1 ].region_swap;
              delete res.addresses[res.addresses.length - 1 ].default_billing;
              delete res.addresses[res.addresses.length - 1 ].region_swap;
              this._checkoutService.set_billing_address(res.addresses[res.addresses.length - 1 ]).subscribe((res)=>{
                this.dataAvaliable = true ;
              })
            })
          })

        }else if(values.defaultBilling==false  && values.defaultShipping) 
        {

            this._userService.set_default_shipping_address(res.addresses[res.addresses.length - 1 ].id).subscribe((res)=>{console.log(res)
              res.addresses[res.addresses.length - 1 ].region_code =res.addresses[res.addresses.length - 1 ].region.region_code; 
              res.addresses[res.addresses.length - 1 ].region_id =res.addresses[res.addresses.length - 1 ].region.region_id; 
              res.addresses[res.addresses.length - 1 ].region_swap =res.addresses[res.addresses.length - 1 ].region.region; 
              delete res.addresses[res.addresses.length - 1 ].region;
              res.addresses[res.addresses.length - 1 ].region = res.addresses[res.addresses.length - 1 ].region_swap;
              res.addresses[res.addresses.length - 1 ].email = res.email;

              delete res.addresses[res.addresses.length - 1 ].default_shipping;
              delete res.addresses[res.addresses.length - 1 ].region_swap;
              this.dataAvaliable = true ;

              // this._checkoutService.set_shipping_address(res.addresses[res.addresses.length - 1 ]).subscribe((res)=>{
              //   console.log(res)
              // })
            })
        }else if(values.defaultBilling && !values.defaultShipping) 
        {
            this._userService.set_default_billing_address(res.addresses[res.addresses.length - 1 ].id).subscribe((res)=>{console.log(res)
              res.addresses[res.addresses.length - 1 ].region_code =res.addresses[res.addresses.length - 1 ].region.region_code; 
              res.addresses[res.addresses.length - 1 ].region_id =res.addresses[res.addresses.length - 1 ].region.region_id; 
              res.addresses[res.addresses.length - 1 ].region_swap =res.addresses[res.addresses.length - 1 ].region.region; 
              delete res.addresses[res.addresses.length - 1 ].region;
              res.addresses[res.addresses.length - 1 ].region = res.addresses[res.addresses.length - 1 ].region_swap;
              delete res.addresses[res.addresses.length - 1 ].default_billing;
              delete res.addresses[res.addresses.length - 1 ].region_swap;

              this._checkoutService.set_billing_address(res.addresses[res.addresses.length - 1 ]).subscribe((res)=>{
                console.log(res)
                this.dataAvaliable = true ;

              })
            })
        }
        
        let toast = this.toast.create({
          message : "Address updated successfully !",
          duration : 3000,
          position : 'top', 
          cssClass : 'toast'
        });
        toast.present();

        this.event.publish("updateAddresses");

      }
      this.navCtrl.pop({animate:false});

    })


  }

  back = () => {
    this.navCtrl
        .pop()
  }

}
