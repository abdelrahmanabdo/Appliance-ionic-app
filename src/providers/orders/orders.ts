import { ProductsProvider } from './../products/products';
import { Observable } from 'rxjs/Observable';
import { HttpClient , HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

/*
  Generated class for the OrdersProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class OrdersProvider {
  APIUrl = 'https://www.app-liance.com/index.php/rest/V1/';
  // APIUrl = 'http://localhost/app-liance.com/index.php/rest/V1/';

  constructor(public http: HttpClient,
    private productService : ProductsProvider  
  ) {
  }

  get_user_orders = () : Observable<any> =>   {
    return this.http
               .get(this.APIUrl + "userOrders?searchCriteria[filter_groups][0][filters][1][field]=customer_email& searchCriteria[filter_groups][0][filters][1][value]="+localStorage.getItem('email'))
               .map((result :any) =>{
                result.items.forEach((item) => {
                  item.items.forEach(item => {
                    this.productService.get_product_image(item.sku).subscribe(images=> item['image']= images[0].file);                    
                  });
                });
                return result ;
              });
  }

  getOrderDetails = (orderNumber) :  Observable<any> =>   {
    return this.http
               .get(this.APIUrl + "orders/"+orderNumber)
               .map((result :any) =>{
                result.items.forEach((item) => {
                   this.productService.get_product_image(item.sku).subscribe(images=> item['image']= images[0].file);
                });
                return result ;
              });
    
  }



}
