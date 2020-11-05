import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import 'rxjs/add/operator/catch';
import { Observable } from 'rxjs/Observable';
import { convertUrlToSegments } from 'ionic-angular/navigation/url-serializer';
import { INHERITED_CLASS_WITH_CTOR } from '@angular/core/src/reflection/reflection_capabilities';

/*
  Generated class for the UserProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class UserProvider {
  APIUrl = 'https://www.app-liance.com/index.php/rest/V1/';
  // APIUrl = 'http://localhost/app-liance.com/index.php/rest/V1/';
  constructor(public http: HttpClient) {
    console.log('Hello UserProvider Provider');
  }

  add_user_address = ( otherAddresses = [] , newAddress ) : Observable<any> => {
    let newAdd = {
      "firstname":localStorage.getItem("firstName"),
      "lastname":localStorage.getItem("lastName"),
      "region":{"region":newAddress.region},
      "city":newAddress.city,
      "countryId":newAddress.countryId,
      "telephone":newAddress.telephone,
      "postcode" : newAddress.postcode,
      "street" : [newAddress.street]
    };

    otherAddresses.push(newAdd);
    return this.http
               .put(this.APIUrl+"customers/me",{
                  "customer" : {
                    "email":localStorage.getItem("email"),
                    "firstname":localStorage.getItem("firstName"),
                    "lastname":localStorage.getItem("lastName"),
                    "websiteId" : 1,
                    "addresses": otherAddresses
                  }
                });
  }

  set_default_shipping_address = ( addressId  ) : Observable<any> => {
    return this.http
               .put(this.APIUrl+"customers/me",{
                  "customer" : {
                    "email":localStorage.getItem("email"),
                    "firstname":localStorage.getItem("firstName"),
                    "lastname":localStorage.getItem("lastName"),
                    "websiteId" : 1,
                    "default_shipping": addressId
                  }
                })
  }

  set_default_billing_address = ( addressId  ) : Observable<any> => {
   return this.http
              .put(this.APIUrl+"customers/me",{
                  "customer" : {
                    "email":localStorage.getItem("email"),
                    "firstname":localStorage.getItem("firstName"),
                    "lastname":localStorage.getItem("lastName"),
                    "websiteId" : 1,
                    "default_billing": addressId
                  }

                })
 }


  edit_user_address = (otherAddresses , newAddress) : Observable <any> => {
    let edited =   {
      "id":newAddress.id,
      "firstname":localStorage.getItem("firstName"),
      "lastname":localStorage.getItem("lastName"),
      "region":{"region":newAddress.region},
      "city":newAddress.city,
      "countryId":newAddress.countryId,
      "telephone":newAddress.telephone,
      "postcode" : newAddress.postcode,
      "street" : [newAddress.street]
    };

    otherAddresses.push(edited)
      return this.http
                 .put(this.APIUrl+"customers/me",{
                    "customer" : {
                      "email":localStorage.getItem("email"),
                      "firstname":localStorage.getItem("firstName"),
                      "lastname":localStorage.getItem("lastName"),
                      "websiteId" : 1,
                      "addresses": otherAddresses
                    }

                  });
  }

  delete_user_address = (addresses ) : Observable<any> => {
    return this.http
               .put(this.APIUrl+"customers/me",{
                  "customer" : {
                    "email":localStorage.getItem("email"),
                    "firstname":localStorage.getItem("firstName"),
                    "lastname":localStorage.getItem("lastName"),
                    "websiteId" : 1,
                    "addresses": addresses
                  }
                });
  }


  change_user_password = (currentPassword , newPassword) : Observable<any> => {
   return this.http
              .put(this.APIUrl + "customers/me/password?customerId="+localStorage.getItem('userid') , {
                  "currentPassword" : currentPassword ,
                  "newPassword" : newPassword
              })
              .catch((error : Response)=>{
                  if(error.status == 401){
                    return Observable.of("wrongPassword");
                  }
              })
  }

  update_specific_user_info = (dataAsObj) => {
    delete dataAsObj.password;
    dataAsObj['website_id'] = 1;
    dataAsObj['id'] = localStorage.getItem('userid') ;

    return this.http
               .put(this.APIUrl + "updateCustomers/"+localStorage.getItem('userid') , {
                  customer :
                  dataAsObj    
                });
  }


  get_store_general_config = () : Observable<any> => {
    return this.http
               .get(this.APIUrl + "store/storeConfigs");  
  }


  /**
   * Send reset password E-mail
   * @param string email
   */
  SendReseetPasswordMail = (email) => {
    return this.http
               .put(this.APIUrl+"customers/password",{
                  "email":email,
                  "template":"email_reset"
                })
                .catch((err : any)=>{
                  if(err.status == 404 && err.error.message === "No such entity with %fieldName = %fieldValue, %field2Name = %field2Value"){
                    return Observable.throw("wrongEmail");
                  }
                });
  }

  /**
   * Reset user's password
   * @param string token
   * @param string newPassword
   */
  ResetUserPassword = (email ,newPassword , token) => {
    return this.http
               .post(this.APIUrl+"customers/resetPassword",{
                  "email" : email ,
                  "resetToken" : token ,
                  "newPassword" : newPassword
                })
                .catch((err : any)=>{
                    if(err.status == 404 && err.error.message === "No such entity with %fieldName = %fieldValue, %field2Name = %field2Value"){
                      return Observable.throw("wrongEmail");
                    }else if (err.error.message === "Reset password token mismatch."){
                      return Observable.throw("tokenExpired");
                    }
                });
    }

}

