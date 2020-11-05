import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

/*
  Generated class for the WishlistProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class WishlistProvider {
  APIUrl = 'https://www.app-liance.com/index.php/rest/V1/';
  // APIUrl = 'http://localhost/app-liance.com/index.php/rest/V1/';

  constructor(public http: HttpClient) {}

  add_product_to_Wishlist = (productId : number) :Observable<any> => {

      return this.http
                 .post(this.APIUrl + 'ipwishlist/add/'+productId , {} );
  }

  get_wishlist = (customerId ) : Observable<any> => {
    return this.http
               .get(this.APIUrl + 'ipwishlist/items?customerId='+customerId );
  }
  
  delete_wishlist = (wishlistItemId ) => {
      return this.http
                 .delete(this.APIUrl + 'ipwishlist/delete/'+wishlistItemId );
  }

  get_wishlist_info = () => {
    return this.http
               .get(this.APIUrl + 'ipwishlist/info');
  }

}
