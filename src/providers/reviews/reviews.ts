import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

/*
  Generated class for the ReviewsProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class ReviewsProvider {
  APIUrl = 'https://www.app-liance.com/index.php/rest/V1/';
  guestUserAddReviewUrl = this.APIUrl + 'review/guest/post';
  loggedInUserAddReviewUrl = this.APIUrl + 'review/mine/post';

  constructor(
              public http: HttpClient
            ) {}

  get_product_reviews  = (productId) :Observable<any> => {
    return this.http
               .get(this.APIUrl+"review/reviews/"+productId)
  }

  addProductReview = (reviewDetails) => {
    if(localStorage.getItem('LoginSession')){
      return this.http
                 .post( this.loggedInUserAddReviewUrl, reviewDetails )
    }else{
      return this.http
                 .post( this.guestUserAddReviewUrl , reviewDetails )
    }
    
  }

}
