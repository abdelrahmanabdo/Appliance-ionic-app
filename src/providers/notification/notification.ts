import { HttpClient , HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

/*
  Generated class for the NotificationProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class NotificationProvider {
  APIUrl = 'https://www.app-liance.com/index.php/rest/V1/';
  requestsHeader ;

  constructor(public http: HttpClient) {
  }


  add_user_token  = (userId , token) => {
    return this.http.post(this.APIUrl + "notification/"+userId+"?token='"+token+"'" , {})
  }

  delete_user_token = (userId) =>{
    return this.http.delete(this.APIUrl + "notification/delete/"+userId , {})

  }
}
