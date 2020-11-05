import { AuthProvider } from './../auth/auth';
import { HttpClient } from '@angular/common/http';
import { Injectable, Injector, Component } from '@angular/core';
import { NavController, ToastCmp, ToastController, Nav, Events } from 'ionic-angular';
import { LoginPage } from '../../pages/login/login';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/throw';

/*
  Generated class for the ApiHandlerProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
let authService : any = null;
const APIUrl = 'https://www.app-liance.com/index.php/rest/V1/'; 
@Injectable()
export class ApiHandlerProvider {
  constructor( private injector  : Injector ) {
     authService = this.injector.get(AuthProvider);
  }

 public handleError(error: Response | any) {

 }

}
