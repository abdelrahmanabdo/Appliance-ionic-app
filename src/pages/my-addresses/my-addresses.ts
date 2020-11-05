import { CheckoutProvider } from '../../providers/checkout/checkout';
import { UserProvider } from '../../providers/user/user';
import { EditAddressesPage } from '../edit-addresses/edit-addresses';
import { AuthProvider } from '../../providers/auth/auth';
import { Component, NgZone } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, ModalController, Events, ToastController, Alert, AlertController } from 'ionic-angular';
import { AddAddressesPage } from '../add-addresses/add-addresses';
import { MAX_LENGTH_VALIDATOR } from '@angular/forms/src/directives/validators';

/**
 * Generated class for the MyAddressesPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-my-addresses',
  templateUrl: 'my-addresses.html',
  providers : [AuthProvider , UserProvider , CheckoutProvider]
})
export class MyAddressesPage {

  userAdresses ;
  countries;
  defaultShippingAddress   ;
  defaultBillingAddress  ;
  dataAvaliable = false ;
  constructor(public navCtrl: NavController ,
              public navParams: NavParams ,
              private _authService : AuthProvider,
              public loading : LoadingController,
              public modal : ModalController,
              public zone : NgZone,
              public event : Events,
              private _userService : UserProvider,
              private _checkoutService : CheckoutProvider,
              public toast : ToastController,
              public alert : AlertController
            ) {
            this.event.subscribe("updateAddresses", ()=>{
              this.zone.run(()=>{    
                  this.ngOnInit();
              })
            })
  }

  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.

     this._authService.getLoggedInUserData(localStorage.getItem('Token')).subscribe((addresses)=> {
     console.log(addresses)
     if(addresses.addresses) {
       console.log(addresses)
       this.userAdresses = addresses;
       this.userAdresses.addresses.forEach( (element  : any) => {
          if(addresses.default_shipping && (element.id == addresses.default_shipping)){
            this.defaultShippingAddress  =  element;
          }
          if(addresses.default_billing &&  (element.id == addresses.default_billing)) {
            this.defaultBillingAddress  = element;
            console.log(this.defaultBillingAddress)
          }

       });
       console.log(this.defaultBillingAddress ,this.defaultShippingAddress )
     }
      this.dataAvaliable = true ;
    });
  }

  addAddress = () => {
    let addModal =this.modal.create("AddAddressesPage",{
      "otherAddresses" : this.userAdresses.addresses ? this.userAdresses.addresses : []
    });
    addModal.present();
  }

  editAddress = (address ) => {
      let editModal =this.modal.create("EditAddressesPage",{
        "oldAddress":address,
        "otherAddresses" : this.userAdresses.addresses
      });
      editModal.present();
  }

  deleteAddress = (index) => {
    let alert = this.alert.create({
      message:"Are you sure ?",
      buttons:[{
      text  :'Cancel',
        role:"cancel"
      
      },
    { 
      'text' : "Delete",
      handler: () => {

        this.userAdresses.addresses.splice(index , 1);
        this._userService.delete_user_address(this.userAdresses.addresses).subscribe((res)=>{
          if( res.addresses.length == this.userAdresses.addresses.length  )           
          {
              let toast = this.toast.create({
                message : "address deleted successfully",
                duration : 3000 , 
                position : 'top', 
                cssClass : 'toast'
              })
              toast.present();
          }
            }); 
      } 
    }]
  });
  alert.present();

  }


  back = () => {
    this.navCtrl.pop({animate:false});
  }
}

