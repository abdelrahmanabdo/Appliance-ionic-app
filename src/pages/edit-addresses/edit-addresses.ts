import { CheckoutProvider } from '../../providers/checkout/checkout';
import { UserProvider } from '../../providers/user/user';
import { MyAddressesPage } from '../my-addresses/my-addresses';
import { Component, NgZone } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, Events } from 'ionic-angular';
import { Validators, FormBuilder, FormGroup, FormControl } from '@angular/forms';

/**
 * Generated class for the EditAddressesPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-edit-addresses',
  templateUrl: 'edit-addresses.html',
  providers : [UserProvider, CheckoutProvider]
})
export class EditAddressesPage {
  addressEditForm : FormGroup;
  oldAdress;
  otherAddress;
  countries;
  countryId;
  dataAvaliable = false ;
  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public formBuilder: FormBuilder,
              private _userService : UserProvider,
              private _checkoutProvider : CheckoutProvider,
              public toast    : ToastController,
              public zone : NgZone,
              public event : Events,
  ) {
    this._checkoutProvider.get_countries_regions().subscribe((countries)=> {
      this.countries     = countries;
      this.dataAvaliable = true ;
     });
    this.oldAdress    = this.navParams.get("oldAddress");
    this.otherAddress = this.navParams.get("otherAddresses");
    
    console.log(this.oldAdress);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad EditAddressesPage');
  }


  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this.addressEditForm = this.formBuilder.group({
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
      { type: 'required', message: 'city is required.'},
    ],
    'countryId': [
      { type: 'required', message: 'country is required.'},
    ],
    'telephone': [
      { type: 'required', message: 'telephone is required.'},
    ],
    'postcode': [
      { type: 'required', message: 'postcode is required.'},
    ],
  
    
  };

  editAddress = (values) => {
    console.log(values)
    console.log(this.oldAdress);
    values.id = this.oldAdress.id
    this._userService.edit_user_address(this.otherAddress,values).subscribe((res)=> {
      if(res) {
        let toast = this.toast.create({
          message : "Address updated successfully !",
          duration : 3000,
          position : 'top', 
          cssClass : 'toast'
        });
        toast.present();
        this.event.publish("updateAddresses");
      }
    },   
    error => this.dataAvaliable = true);
    this.navCtrl.pop({animate:false});
  }

  back = () => {
    this.navCtrl
        .pop();
  }
}
