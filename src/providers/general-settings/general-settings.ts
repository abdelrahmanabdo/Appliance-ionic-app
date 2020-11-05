import { Observable } from 'rxjs/Observable';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

/*
  Generated class for the GeneralSettingsProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
const APIUrl = 'https://www.app-liance.com/index.php/rest/V1/';


@Injectable()
export class GeneralSettingsProvider {


  constructor(public http: HttpClient) {
    console.log('Hello GeneralSettingsProvider Provider');
  }

  /**
   * Get all avaliable currencies in the store 
   */
  getAvailableCurrencies = () : Observable<any> =>  {
    return this.http.get(APIUrl+'directory/currency')
  }

  /**
   * Get user's default currency
   */
  getUserCurrentCurrency = () : Observable<any> => {
     
     return this.http.get(APIUrl+"carts/mine",{headers:{
                        authorization : `Bearer ${localStorage.getItem('Token')}` 
                  }}).map((res:any)=>{
                        return {
                                currency : res.currency.quote_currency_code,
                                rate : res.currency.base_to_quote_rate
                        };
                  })
  }
}
