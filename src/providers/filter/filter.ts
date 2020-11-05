import { IproductModel } from '../../models/IproductModel.model';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

/*
  Generated class for the FilterProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class FilterProvider {
    
  APIUrl = 'https://www.app-liance.com/index.php/rest/V1/';
  // APIUrl = 'http://localhost/app-liance.com/index.php/rest/V1/';

  token = localStorage.getItem('Token');
  constructor(public http: HttpClient) {
    console.log('Hello FilterProvider Provider');
  }

  get_filtered_products = (searchCriteria) : Observable<IproductModel> =>  {
      return this.http.get<IproductModel>(this.APIUrl+'products?'+searchCriteria).map((res)=>{
        res.items.forEach(product => {
          product.custom_attributes.forEach(element => {
            product[element.attribute_code]= element.value;
          });
        });
        return res;
    
      });
  }

  sortByfilter = (categoryId : number , sortBy : string ) => {
    if(sortBy === 'newArrival'){
      return this.http
                 .get<IproductModel>(this.APIUrl+"products?searchCriteria[sortOrders][0][field]=created_at&searchCriteria[sortOrders][0][direction]=DESC&searchCriteria[filterGroups][1][filters][1][field]=category_id& searchCriteria[filterGroups][1][filters][1][value]="+categoryId)
    }else if (sortBy === 'bestSelling'){
      return this.http
                 .get<IproductModel>(this.APIUrl+"products?searchCriteria[sortOrders][0][field]=ordered_qty&searchCriteria[sortOrders][0][direction]=DESC&searchCriteria[filterGroups][1][filters][1][field]=category_id& searchCriteria[filterGroups][1][filters][1][value]="+categoryId)
    }else if (sortBy === 'topRated'){

    }else if (sortBy === 'higherPrice'){
      return this.http
                 .get<IproductModel>(this.APIUrl+"products?searchCriteria[sortOrders][0][field]=price&searchCriteria[sortOrders][0][direction]=DESC&searchCriteria[filterGroups][1][filters][1][field]=category_id& searchCriteria[filterGroups][1][filters][1][value]="+categoryId)
    }else if (sortBy === 'lowerPrice'){
      return this.http
                 .get<IproductModel>(this.APIUrl+"products?searchCriteria[sortOrders][0][field]=price&searchCriteria[sortOrders][0][direction]=ASC&searchCriteria[filterGroups][1][filters][1][field]=category_id& searchCriteria[filterGroups][1][filters][1][value]="+categoryId)
    }
  }
}

