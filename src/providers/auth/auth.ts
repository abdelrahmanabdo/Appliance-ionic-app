import { Injectable, ErrorHandler } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import {HttpHeaders,HttpClient,HttpErrorResponse} from '@angular/common/http';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/repeat';
import 'rxjs/add/operator/shareReplay';
import 'rxjs/add/operator/mergeMap';
// import * as $ from 'jquery';

/*
  Generated class for the LoginProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class AuthProvider {
  APIUrl = 'https://www.app-liance.com/index.php/rest/V1/';
  // APIUrl = 'http://localhost/app-liance.com/index.php/rest/V1/';

  constructor(private http: HttpClient) {

  }
  

    get_admin_token = (username , password) : Observable<any> => { 
      let data = new FormData();
      data.set('username', username);
      data.set('password', password);
      return this.http
                 .post(this.APIUrl + "integration/admin/token" , data)
    }

    get_cutomer_token = (username , password) : Observable<any> => { 
      let data = new FormData();
      data.set('username', username);
      data.set('password', password);
      return this.http
                 .post(this.APIUrl + "integration/customer/token" , data)
    }
    

    loginAPI =  (user) : Observable <any> => {
      var loginapiURL = "integration/customer/token";  
      var headers       = new HttpHeaders();
      var formData      = new FormData(); 
      formData.append('username',user.email);
      formData.append('password',user.password);
      headers.set('Content-Type','application/json'); 
      return this.http
                 .post(this.APIUrl + loginapiURL,formData)
    // .repeat(3)
    }

    getLoggedInUserData =  (token) : Observable<any> => {
      return this.http
                 .get(this.APIUrl + 'customers/me', {headers : {'Authorization' :'Bearer '+ token}})
    }

    /**
     * Create a new account 
     * @param user data (first name , last name , password)
     * @return status of request 
     */
    create_account =  (userData) : Observable <any> => {
      let createAccountURL = 'customers'
      return this.http
                 .post(this.APIUrl  + createAccountURL , 
                        { "customer": {
                            "email"     : userData.email,
                            "firstname" : userData.firstName,
                            "lastname"  : userData.lastName
                        },
                        "password": userData.password},{headers:{'Content-Type':'application/json'}})
                  .map(
                        (result) => { result['status'] = 1 ;return result }  ,
                        (err:HttpErrorResponse) =>{ return err.error.message}
                      );
    }

    /**
     * Login by email
     */
    loginByCustomerId = (customerId) : Observable<any>  =>{
        return this.http
                   .post(this.APIUrl+"integration/byCustomerId/token" , {"customerId":customerId})
    }

    /**
     * Check if user is exists or not 
     */
    check_user_by_email = (email)  : Observable<any> => {
        return this.http
                   .get(this.APIUrl + 'checkCustomer?email='+email)
                   .catch((err )=>{
                        return Observable.of(err)
                    })
    }
}
