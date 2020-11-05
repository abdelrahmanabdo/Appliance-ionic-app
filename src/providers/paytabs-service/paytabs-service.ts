import { HttpClient ,HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import PaytabsPaymentAuth from '../../paymentAuth/paytabs_payment_auth';


// import { forkJoin } from "rxjs/observable/forkJoin";

/*
  Generated class for the ProductsProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class PaytabsServiceProvider {
  paytabsConfig   = new PaytabsPaymentAuth ;
  payTabsapiUrl   = 'https://www.paytabs.com/apiv2/';
  merchantFormData = new FormData ;

  constructor(
              public http: HttpClient
             ) {
               console.log(this.paytabsConfig.merchant_email);
        this.merchantFormData.set('merchant_email',this.paytabsConfig.merchant_email);
        this.merchantFormData.set('secret_key',this.paytabsConfig.secret_key);
  }

  /**
   * Validate the sercret key of merchant account
   */
  validate_secret_key = () :Observable<any> => {
   return this.http.post(this.payTabsapiUrl+'validate_secret_key' ,this.merchantFormData);
  }

  create_pay_page = (userPaymentInfo : any) : Observable<any> => {
      this.merchantFormData.set("site_url" , this.paytabsConfig.site_url);
      this.merchantFormData.set("return_url" , this.paytabsConfig.return_url);
      this.merchantFormData.set("ip_merchant", this.paytabsConfig.merchant_ip);
      this.merchantFormData.set("cms_with_version", this.paytabsConfig.cms_with_version);
      this.merchantFormData.set("msg_lang", this.paytabsConfig.msg_lang);
      this.merchantFormData.set("title" , userPaymentInfo.title)
      this.merchantFormData.set("cc_first_name" , userPaymentInfo.cc_first_name);
      this.merchantFormData.set("cc_last_name" , userPaymentInfo.cc_last_name);
      this.merchantFormData.set("cc_phone_number", userPaymentInfo.cc_phone_number);
      this.merchantFormData.set("phone_number", userPaymentInfo.phone_number);
      this.merchantFormData.set("email", userPaymentInfo.email);
      this.merchantFormData.set("products_per_title", userPaymentInfo.products_per_title);
      this.merchantFormData.set("unit_price", userPaymentInfo.unit_price);
      this.merchantFormData.set("quantity", userPaymentInfo.quantity);
      this.merchantFormData.set("amount", userPaymentInfo.amount);
      this.merchantFormData.set("currency", userPaymentInfo.currency);
      this.merchantFormData.set("ip_customer", userPaymentInfo.ip_customer);
      this.merchantFormData.set("billing_address", userPaymentInfo.billing_address);
      this.merchantFormData.set("state", userPaymentInfo.state);
      this.merchantFormData.set("city", userPaymentInfo.city);
      this.merchantFormData.set("postal_code", userPaymentInfo.postal_code);
      this.merchantFormData.set("country", userPaymentInfo.country);
      this.merchantFormData.set("address_shipping", userPaymentInfo.address_shipping);
      this.merchantFormData.set("city_shipping", userPaymentInfo.city_shipping);
      this.merchantFormData.set("state_shipping", userPaymentInfo.state_shipping);
      this.merchantFormData.set("postal_code_shipping", userPaymentInfo.postal_code_shipping);
      this.merchantFormData.set("country_shipping", userPaymentInfo.country_shipping);
      this.merchantFormData.set("other_charges", userPaymentInfo.other_charges);
      this.merchantFormData.set("reference_no", userPaymentInfo.reference_no);
      this.merchantFormData.set("products_per_title", userPaymentInfo.products_per_title);
      
      
      
    return this.http
               .post(this.payTabsapiUrl+'create_pay_page' , this.merchantFormData)
  }


  verify_payment = (payment_reference : string) : Observable<any> => {
    this.merchantFormData.set("payment_reference",payment_reference);
    return this.http
               .post(this.payTabsapiUrl+"verify_payment" , this.merchantFormData)
  }



}


