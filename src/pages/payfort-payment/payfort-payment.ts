import { PayFortServiceProvider } from '../../providers/pay-fort-service/pay-fort-service';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Validators, FormBuilder, FormGroup, FormControl } from '@angular/forms';

/**
 * Generated class for the PayfortPaymentPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-payfort-payment',
  templateUrl: 'payfort-payment.html',
  providers : [PayFortServiceProvider]
  
})
export class PayfortPaymentPage {
  payment_form: FormGroup;
  dataAvaliable = false ;
  constructor(public navCtrl: NavController, 
              public navParams: NavParams , 
              public formBuilder: FormBuilder,
              private _payfortService  : PayFortServiceProvider,

            ) {
                this.dataAvaliable = true ;
  }

  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this.payment_form = this.formBuilder.group({
      cardNumber: new FormControl('', Validators.compose([
        Validators.maxLength(16),
        Validators.minLength(16),
        Validators.required,       
      ])),
      cardHolderName: new FormControl('', Validators.compose([
        Validators.required,
      ])),
      expiryDate : new FormControl(''),     
      CVV: new FormControl('', Validators.compose([
        Validators.required,
        Validators.maxLength(3)
      ])),
    });

    
  }

  validation_messages = {
    'cardNumber': [
      { type: 'required', message:  'card number is required.' },
      { type: 'minlength', message: 'Card number must be 16 number' },
      { type: 'maxlength', message: 'Card number must be 16 number' }
      
    ],
    'cardHolderName': [
      { type: 'required', message: 'card holder name is required.' },
     
    ],
    'CVV' : [
      { type: 'required', message: 'CVV  is required.' },
      { type: 'maxlength', message: 'CCV must be 3 numbers' },

    ]
  };

  ionViewDidLoad() {
    console.log('ionViewDidLoad PayfortPaymentPage');
  }

  paymentFormSubmit = (values) => {
          this._payfortService.getToken().subscribe((res)=>{
      console.log(res);
      if(res.response_code === "22000") {
          this._payfortService.merchant_page_request(values.cardNumber,values.cardHolderName ,values.expiryDate , values.CVV,res.sdk_token).subscribe( (res2) => {
              console.log("res2",res2)
          })
      }
    });
  }
}
