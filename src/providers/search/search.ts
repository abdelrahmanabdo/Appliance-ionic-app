import { Observable } from 'rxjs/Observable';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

/*
  Generated class for the SearchProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class SearchProvider {
  APIUrl = 'https://www.app-liance.com/index.php/rest/V1/';
  // APIUrl = 'http://localhost/app-liance.com/index.php/rest/V1/';

  constructor(public http: HttpClient) {
  }

  filter_products = (filterValue) : Observable<any> => {
    return this.http
               .get(this.APIUrl + "products?searchCriteria[filter_groups][0][filters][0][field]=name&searchCriteria[filter_groups][0][filters][0][value]=%25"+filterValue+"%25&searchCriteria[filter_groups][0][filters][0][condition_type]=like");
  }

}
