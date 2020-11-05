import { IproductModel } from '../../models/IproductModel.model';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/retry';
import 'rxjs/add/operator/repeat';
import 'rxjs/add/operator/shareReplay';
import 'rxjs/add/operator/mergeMap';
import { IitemsModel } from '../../models/IitemModel.model';
import { ReviewsProvider } from '../reviews/reviews';


// import { forkJoin } from "rxjs/observable/forkJoin";

/*
  Generated class for the ProductsProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class ProductsProvider {
  APIUrl = 'https://www.app-liance.com/index.php/rest/V1/';
  // APIUrl = 'http://127.0.0.1/app-liance.com/index.php/rest/V1/';

  product: IproductModel;
  constructor(
    public http: HttpClient,
    private reviewsService : ReviewsProvider
  ) {
  }

  /** 
   * Get products
   * 
  */
  getProducts(): Observable<IproductModel> {
    return this.http.get<IproductModel>(this.APIUrl + 'products?searchCriteria[pageSize]=20').map((result) => {
      result.items.forEach(product => {
        product.custom_attributes.forEach(element => {
          product[element.attribute_code] = element.value
        });
      });
      return result;
    });;
  }

  /**
   * Get product data by its SKU
   * @param sku : string
   */
  get_prodcut_by_sku = (sku: string): Observable<IproductModel> => {
    return this.http.get<IproductModel>(this.APIUrl + "products/" + sku).map((result) => {
      result.custom_attributes.forEach(element => {
        result[element.attribute_code] = element.value
        if(element.attribute_code === 'product_brand'){
          this.getBrandsList().subscribe((brands)=>{
            brands.forEach(brand => {
              if(brand.brand_id === element.value)
              {
                result['brand'] = brand.name ; 
              }
            });
          });
        }
      });
      return result;
    });
  }

  /** 
   * Get Brands list
   * 
  */
  getBrandsList(): Observable<any> {
    return this.http
      .get(this.APIUrl + 'brands');
  }


  /** 
   * Get Brands list
   * 
  */
  getBrandProducts(brandId): Observable<IproductModel> {
    return this.http
      .get<IproductModel>(this.APIUrl + 'products?searchCriteria[filter_groups][0][filters][0][field]=product_brand&searchCriteria[filter_groups][0][filters][0][value]=' + brandId)
      .map((result) => {
        result.items.forEach(product => {
          this.reviewsService.get_product_reviews(product.id).subscribe((reviews)=>{
            product.custom_attributes.forEach(element => {
              product[element.attribute_code] = element.value
              product['rating'] = (reviews[0].avg_rating_percent / 100 )*5;
            });
          })

        });
        return result;
      });
  }

  /**
   * Get all categories
   */
  getCategories(): Observable<any> {

    return this.http
      .get(this.APIUrl + 'categories');

  }

  /**
 * Get all categories
 */
  get_category_by_id(id): Observable<any> {

    return this.http
      .get(this.APIUrl + 'categories/' + id)
  }

  /**
   * Get featured prdoucts 
   */

  get_featured_products = (): Observable<IproductModel> => {
    return this.http
      .get<IproductModel>(this.APIUrl + "products?searchCriteria[filter_groups][0][filters][0][field]=is_featured&searchCriteria[filter_groups][0][filters][0][value]=1&searchCriteria[pageSize]=10")
      .map((result) => {
        result.items.forEach(product => {
          this.reviewsService.get_product_reviews(product.id).subscribe((reviews)=>{
            product.custom_attributes.forEach(element => {
              product[element.attribute_code] = element.value
              product['rating'] = (reviews[0].avg_rating_percent / 100 )*5;
            });
          })

        });
        return result;
      });
  }

  /**
   * Get featured prdoucts 
   */

  get_new_products = (): Observable<IproductModel> => {
    return this.http
      .get<IproductModel>(this.APIUrl + "products?searchCriteria[sortOrders][0][field]=created_at&searchCriteria[pageSize]=30&searchCriteria[sortOrders][0][direction]=DESC")
      .map((result) => {
        result.items.forEach(product => {
          this.reviewsService.get_product_reviews(product.id).subscribe((reviews)=>{
            product.custom_attributes.forEach(element => {
              product[element.attribute_code] = element.value
              product['rating'] = (reviews[0].avg_rating_percent / 100 )*5;
            });
          })

        });
        return result;  
      });
  }

  /**
   * Get bestseller products 
   */
  get_bestSeller_products = (): Observable<IproductModel> => {
    return this.http
      .get<IproductModel>(this.APIUrl + "products?searchCriteria[sortOrders][0][field]=ordered_qty&searchCriteria[sortOrders][0][direction]=DESC&searchCriteria[pageSize]=10")
      .map((result) => {
       result.items.forEach(product => {
          this.reviewsService.get_product_reviews(product.id).subscribe((reviews)=>{
            product.custom_attributes.forEach(element => {
              product[element.attribute_code] = element.value
              product['rating'] = (reviews[0].avg_rating_percent / 100 )*5;
            });
          })

        });
        return result;
      });
  }

  getConfigurableProductChildren = (options) => {
    var searchCriteria = ``;
    for (let i = 0; i < options.length; i++) {
      searchCriteria += `searchCriteria[filterGroups][${i}][filters][${i}][field]=${options[i]['option']}&searchCriteria[filterGroups][${i}][filters][${i}][value]=${options[i]['value']}&`
    }
    return this.http
      .get<IproductModel>(this.APIUrl + 'products?' + searchCriteria);
  }

  /**
   * Get categories' products
   * @param id 
   */
  get_categories_products(id): Observable<IproductModel> {
    return this.http
      .get<IproductModel>(this.APIUrl + 'products?searchCriteria[filterGroups][0][filters][0][field]=category_id&searchCriteria[filterGroups][0][filters][0][value]=' + id)
      .map((result) => {
        result.items.forEach(product => {
          this.reviewsService.get_product_reviews(product.id).subscribe((reviews)=>{
            product.custom_attributes.forEach(element => {
              product[element.attribute_code] = element.value
              product['rating'] = (reviews[0].avg_rating_percent / 100 )*5;
            });
          })

        });
        return result;
      });

    }

  /**
   * Get product by passing its name 
   * @param productName : string
   */
  getProductByItsName = (productName: string): Observable<any> => {
    return this.http
      .get(this.APIUrl + 'products?searchCriteria[filter_groups][0][filters][0][field]=name&searchCriteria[filter_groups][0][filters][0][value]=%25' + productName + '%25&searchCriteria[filter_groups][0][filters][0][condition_type]=like')

  }

    /**
   * Get product's image by sku
   * @param sku  
   */
  get_product_image(sku): Observable<any> {
    return this.http
      .get(this.APIUrl + 'products/' + sku + '/media')
  }

  /**
   * Get product information by sku
   * @param sku 
   */
  searching_for_products_SKU(sku): Observable<IproductModel> {
    return this.http.get<IproductModel>(this.APIUrl + 'products/' + sku + '?pass=1')
      .map((res) => {
        res.items.forEach(product => {
          product.custom_attributes.forEach(element => {
            product[element.attribute_code] = element.value;
          });
        });
        return res;
      });;
  }



  /**
   * Get product by id
   * @param id number
   */
  getProductById = (id: number): Observable<any> => {
    return this.http
      .get(this.APIUrl + 'products?searchCriteria[filterGroups][0][filters][0][field]=entity_id&searchCriteria[filterGroups][0][filters][0][condition_type]=eq&searchCriteria[filterGroups][0][filters][0][value]=' + id)
  }


  /**
   * Get product options
   */
  getProductOptionsLabel = (option): Observable<any> => {
    return this.http
      .get(this.APIUrl + 'products/attributes/' + option + '/options')
  }

  /**
   * Get product brand
   * @param productId int
   * 
   */
  getProductBrand = (productId : number , brandId) => {
    return this.http
               .get(this.APIUrl+'products?searchCriteria[filterGroups][0][filters][0][field]=entity_id&searchCriteria[filterGroups][0][filters][0][condition_type]=eq&searchCriteria[filterGroups][0][filters][0][value]=' + productId
               +'&searchCriteria[filterGroups][1][filters][1][field]=brand_id&searchCriteria[filterGroups][1][filters][1][condition_type]=eq&searchCriteria[filterGroups][1][filters][1][value]='+brandId)
  }
}
