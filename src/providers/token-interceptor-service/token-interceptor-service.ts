import { AlertController } from 'ionic-angular';
import { AuthProvider } from './../auth/auth';
import { HttpClient, HttpInterceptor, HttpRequest, HttpErrorResponse } from '@angular/common/http';
import { Injectable, Injector } from '@angular/core';
import 'rxjs/Rx';
import 'rxjs/add/operator/switchMap';

/*
  Generated class for the TokenInterceptorServiceProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class TokenInterceptorServiceProvider implements HttpInterceptor {
  authService;
  constructor(public http: HttpClient, public injector: Injector, public alert: AlertController) {
    this.authService = this.injector.get(AuthProvider);

  }

  intercept = (req
    , next) => {
    if (localStorage.getItem('LoginSession')) {
      const reqClone = req.clone({ headers: req.headers.set("Authorization", "Bearer " + localStorage.getItem('Token')) })
      return next.handle(reqClone).do((event) => {

      }, (err: any) => {
        if (err instanceof HttpErrorResponse) {
          console.error(err)
          if (err.status === 401) {
            this.authService.loginByCustomerId(localStorage.getItem('userid')).subscribe((newToken) => {
              localStorage.setItem('Token', newToken);
              let newreq = req.clone({ headers: req.headers.set("Authorization", "Bearer " + localStorage.getItem('Token')) });
              return next.handle(newreq)
            })
          } 

        }
      })
    } else {
      return next.handle(req).do((event) => {

      }, (err: any) => {
        if (err instanceof HttpErrorResponse) {
          // let alert = this.alert.create({
          //   message: err.error.message,
          //   buttons: [{
          //     text: "Okay",
          //     role: 'cancel'
          //   }]
          // });
          // alert.present();
        }

      })

    }
  }
}
