import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

/*
  Generated class for the AramexProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class AramexProvider {
  aramexAPIKey = "95e42c77-ea13-45eb-8984-97a1402edb47";  // testing 
  // APIKey ="a96e2856-817b-43b4-9963-5b2833964986";  // Production 
  aramexAPIUrl = 'https://sandbox-api.postmen.com/v3';  // testing
  // aramexAPIUrl = 'https://production-api.postmen.com/v3';  // production

  APIUrl = 'https://www.app-liance.com/index.php/rest/V1/';

  constructor(public http: HttpClient) {
    console.log('Hello AramexProvider Provider');
  }

  /**
   * Calculate rate 
   */

  calculate_rate = () => {

  }


}
