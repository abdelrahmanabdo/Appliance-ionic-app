import { HttpClient, HttpInterceptor } from '@angular/common/http';
import { Injectable } from '@angular/core';

/*
  Generated class for the LanguageInterceptorServiceProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class LanguageInterceptorServiceProvider  implements HttpInterceptor{

  constructor(public http: HttpClient) {
  }

    intercept = (req 
              ,next ) => {
        let customedUrl = req.url;
        customedUrl = customedUrl.replace(/rest/g,"rest/"+localStorage.getItem('lang'))
        const reqClone =  req.clone({ url: customedUrl })
        return  next.handle(reqClone);
  
  }
}
