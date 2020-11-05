import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import PayfortPaymentAuth from '../../paymentAuth/payfort_payment_auth';

/*
  Generated class for the PayFortServiceProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class PayFortServiceProvider {
  payfortConfig   = new PayfortPaymentAuth ;
  //test Environment URL
  payFortapiUrl   = 'https://sbpaymentservices.payfort.com/FortAPI/paymentApi';
  payFortMerchantPageApi  = "https://sbcheckout.PayFort.com/FortAPI/paymentPage";
  // production Environment URL
  // payTabsapiUrl   = 'https://paymentservices.payfort.com/FortAPI/paymentApi';
  
  merchantFormData = new FormData ;

  constructor(public http: HttpClient ) {

  }


  getToken = ()  : Observable<any> => {


    return  this.http.post(this.payFortapiUrl , JSON.stringify({
        service_command : "SDK_TOKEN" , 
        access_code     : this.payfortConfig.access_code  ,
        merchant_identifier : this.payfortConfig.merchant_identifier ,
        device_id             :"ffffffff-a9fa-0b44-7b27-29e70033c587",
        // merchant_reference : "XYZ9239-yu898" ,
        language           : "en",
        signature          : this.payfortConfig.get_token_generate_signature("USD","aabdo@road9media.com","XYZ9239-yu898","ffffffff-a9fa-0b44-7b27-29e70033c587")
       })
      );
  }

  merchant_page_request =  (card_number, card_holder_name , card_security_code , expiry_date ,token) :Observable<any> => {
    let paymentParams = new FormData();
    paymentParams.set('service_command',"TOKENIZATION");
    paymentParams.set('access_code', this.payfortConfig.access_code);
    paymentParams.set('merchant_identifier',this.payfortConfig.merchant_identifier);
    paymentParams.set('merchant_reference',"XYZ9239-yu898");
    paymentParams.set('language',this.payfortConfig.language);
    paymentParams.set('signature',this.payfortConfig.tokeninzation_generate_signature("XYZ9239-yu898",token)),
    paymentParams.set('card_number',card_number),
    paymentParams.set('card_security_code',card_security_code),
    paymentParams.set('card_holder_name',card_holder_name),
    paymentParams.set('expiry_date',"2105"),
    paymentParams.set('token_name',token),
    paymentParams.set('remember_me',"YES"),
    paymentParams.set('return_url',this.payfortConfig.return_url)
      return this.http.post(this.payFortMerchantPageApi,paymentParams);
  }



}

