import { HttpClient ,HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/retry';
import 'rxjs/add/operator/repeat';
import 'rxjs/add/operator/shareReplay';
/*
  Generated class for the CheckoutProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class CheckoutProvider {
  APIUrl = 'https://www.app-liance.com/index.php/rest/V1/';
  // APIUrl = 'http://localhost/app-liance.com/index.php/rest/V1/';
  billing_address;
  constructor(public http: HttpClient) {
  }
  /** 
   *  
   * Get all countries and their available regions
  */
  get_countries_regions () : Observable<any> {
    return this.http.get(this.APIUrl +'directory/countries')
  }

  get_shipping_method(shippingData) {
    if(shippingData.region instanceof Object){
      delete shippingData.region;
      delete shippingData.default_billing;
      delete shippingData.default_shipping;
    }

    return this.http.post(this.APIUrl +'carts/mine/estimate-shipping-methods',{ 
       "address": shippingData
    });

  }

  get_guest_shipping_method(shippingData) {
    return this.http.post(this.APIUrl +'guest-carts/'+localStorage.getItem('cartToken')+'/estimate-shipping-methods',{ 
       "address": shippingData
    })

  }


  get_payment_inforamtion = () : Observable<any> => {
    return this.http.get(this.APIUrl+"carts/mine");
  }

  get_payment_methods = () => {
    return this.http.get(this.APIUrl+"carts/mine/payment-methods");
  }

  get_guest_payment_methods = () => {
    return this.http.get(this.APIUrl+"guest-carts/"+localStorage.getItem("cartToken")+"/payment-methods" );
  }

  get_billing_address = () : Observable<any> => {
    
    return this.http.get(this.APIUrl+"carts/mine" )
  }

  set_shipping_address = (shipping_address , shippingMethodCode , ShippingCarrierCode) : Observable<any> => {
    delete shipping_address.id
    return this.http.post(this.APIUrl+"carts/mine/shipping-information",{
      "addressInformation": { "shippingAddress" :  shipping_address , "shippingCarrierCode" : shippingMethodCode, "shippingMethodCode":ShippingCarrierCode}
    } );
  }



  prepareForCheckout = (shipping_address ,billing_address, shippingMethod) : Observable<any> => {
    if( shipping_address.region && shipping_address.region instanceof Object){
        shipping_address.region = shipping_address.region.region;
        shipping_address.region_code = shipping_address.region.region_code;
        delete shipping_address.region;
        delete shipping_address.default_shipping;
    }

    if(billing_address &&  billing_address.region instanceof Object){
      billing_address.region = billing_address.region.region;
      billing_address.region_code = billing_address.region.region_code;
      delete billing_address.region;
      delete billing_address.default_billing;
    }
    return this.http.post(this.APIUrl+"carts/mine/shipping-information",{
      addressInformation: {   "shippingAddress" :  shipping_address ,
                              "billingAddress": billing_address, 
                              "shippingMethodCode":shippingMethod.method_code , 
                              "shippingCarrierCode":shippingMethod.carrier_code}
    });
  }

  guestPrepareForCheckout = (shipping_address, shippingMethod) : Observable<any> => {
    return this.http.post(this.APIUrl+"guest-carts/"+localStorage.getItem('cartToken')+"/shipping-information",{
      "addressInformation": { "shippingAddress" :  shipping_address ,"billingAddress": shipping_address, "shippingMethodCode":shippingMethod.method_code , "shippingCarrierCode":shippingMethod.carrier_code}
    } );
  }

  set_billing_address = (billing_address) : Observable<any> => {
    if(billing_address.region){
      billing_address.region_code = billing_address.region.region_code;
      billing_address.region_id = billing_address.region.region_id;
      billing_address.region = billing_address.region.region;
    }
    delete billing_address.default_billing;
    delete billing_address.default_shipping;
    delete billing_address.id;
    
    return this.http.post(this.APIUrl+"carts/mine/billing-address",{
      "address": billing_address
    } );
  }

  create_an_order = (shipping_address, billingAddress, paymentMethod) => {
      return this.http.post(this.APIUrl+"carts/mine/payment-information",{
        "paymentMethod": {"method":paymentMethod} , "billing_address" : billingAddress  , 'shipping_address' : shipping_address
      } );
  }


  guest_create_an_order = (shipping_address, paymentMethod) => {
    return this.http.post(this.APIUrl+"guest-carts/"+localStorage.getItem('cartToken')+"/payment-information",{
      "paymentMethod": {"method":paymentMethod} , "billing_address" : shipping_address  , 'shipping_address' : shipping_address , email : shipping_address.email
    } );
}

}


