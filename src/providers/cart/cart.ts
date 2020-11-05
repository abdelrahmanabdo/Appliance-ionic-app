import { forkJoin } from 'rxjs/observable/forkJoin';

import { HttpResponse } from '@angular/common/http/src/response';
import { ApiHandlerProvider } from '../api-handler/api-handler'; ProductsProvider
import { ProductsProvider } from '../products/products';

import { Observable } from 'rxjs/Observable';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import 'rxjs/add/operator/retryWhen';


/*
  Generated class for the CartProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class CartProvider {
  APIUrl = 'https://www.app-liance.com/index.php/rest/V1/';

  constructor(public http: HttpClient,
    private handleAPIRespons: ApiHandlerProvider,
    private productService: ProductsProvider) {
  }

  /** 
 * 
 * Get user's cart inforamtion
 * 
*/
  get_user_cart(): Observable<any> {
    let form = new FormData();
    form.append('customerId', localStorage.getItem('userid'));
    return this.http
      .post(this.APIUrl + 'carts/mine', form)
      .mergeMap(result => this.http.get(this.APIUrl + 'carts/mine'))
      .map((result: any) => {
        result.items.forEach((item) => {
          this.productService.get_product_image(item.sku).subscribe(images =>{ 
            if(images.length > 0){
              item['image'] = images[0].file
            }
        });
        });
        return result;
      });
  }

  /**
   * Get total cost of user's cart 
   * 
   * @param cartId : number
   */
  get_cart_totals = (): Observable<any> => {
    return this.http.get(this.APIUrl + "carts/mine/totals")
  }


  /**
 * Add products' to cart
 * 
 * @param sku product's Sku
 * @param Qty wanted quantity
 * @param quote_id cart id
 */
  add_to_cart(sku, Qty, quote_id): Observable<any> {
    return this.http.post(this.APIUrl + 'carts/mine/items', {
      "cartItem": {
        "sku": sku,
        "qty": Qty,
        "quote_id": quote_id
      }
    });
  }


  remove_from_cart = (product_id): Observable<any> => {
    return this.http
      .delete(this.APIUrl + 'carts/mine/items/' + product_id)
  }

  /**
   * update authorized user's  cart 
   * I can't send image with request so i delete it from request and push it in response to display items image in cart
   */
  updateCart = (item , image ): Observable<any> => {
    return this.http
      .post(this.APIUrl + "carts/mine/items", { "cartItem": item })
      .map((result: any) => {
        result['image']= image ;
        return result;
      });
  }

  apply_discount_coupon = (cartId, coupon: string): Observable<any> => {
    return this.http.put(this.APIUrl + "carts/" + cartId + "/coupons/" + coupon, {})
  }

  guest_apply_discount_coupon = (coupon: string): Observable<any> => {
    return this.http.put(this.APIUrl + "guest-carts/" + localStorage.getItem('cartToken') + "/coupons/" + coupon, {})
  }

  get_cart_items_count = () => {
    return this.http.get(this.APIUrl + "carts/mine/items").map((res: any) => {
      return res.length
    })
  }

  /**
   * 
   * Guest user APIs
   * 
   */

  create_guest_cart = () => {
    return this.http.post(this.APIUrl + "guest-carts", {})
  }

  add_prdocuts_to_cart = (sku) => {
    return this.http.post(this.APIUrl + "guest-carts/" + localStorage.getItem("cartToken") + "/items", {
      "cartItem": { "quote_id": localStorage.getItem("cartToken"), "sku": sku, "qty": 1 }
    })
  }

  get_guest_cart = (): Observable<any> => {
    return this.http.get(this.APIUrl + "guest-carts/" + localStorage.getItem("cartToken"))
      .map((result: any) => {
        result.items.forEach((item) => {
          this.productService.get_product_image(item.sku).subscribe(images => {
            item['image'] = images[0].file
          });
        });
        return result;
      });
  }

  get_guest_cart_totals = (): Observable<any> => {
    return this.http.get(this.APIUrl + "guest-carts/" + localStorage.getItem("cartToken") + "/totals")

  }

  remove_from_guest_cart = (product_id): Observable<any> => {
    return this.http.delete(this.APIUrl + 'guest-carts/' + localStorage.getItem("cartToken") + '/items/' + product_id);
  }

  /**
   * update guest cart 
   * I can't send image with request so i delete it from request and push it in response to display items image in cart
   */
  update_guest_Cart = (item, image , quote_id): Observable<any> => {
    item.quote_id = localStorage.getItem('cartToken');
    return this.http
      .post(this.APIUrl + "guest-carts/" + quote_id + "/items", { "cartItem": item })
      .map((result: any) => {
        result['image']= image ;
        return result;
      });
  }

  get_guest_cart_items_count = () => {
    return this.http.get(this.APIUrl + "guest-carts/" + localStorage.getItem("cartToken") + "/items").map((res: any) => {
      return res.length
    })

  }

  mergeGustWithCustomerCart = () => {
    return new Promise((resolve, reject) => {
      let guestCart = this.get_guest_cart();
      let customerCart = this.get_user_cart();
      forkJoin([guestCart, customerCart]).subscribe((result) => {
        result[0].items.forEach(element => {
          this.add_to_cart(element.sku, element.qty, result[1].id).subscribe(res => {
            if (res) { resolve(true) } else { resolve(false) };
          })
        });
      })
    })


  }
}
