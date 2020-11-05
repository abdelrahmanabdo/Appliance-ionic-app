import { SearchProvider } from '../../providers/search/search';
import { ProductsProvider } from '../../providers/products/products';
import { FilterProvider } from '../../providers/filter/filter';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController , AlertController, Events } from 'ionic-angular';
import * as $ from "jquery";
import { Keyboard } from '@ionic-native/keyboard';

/**
 * Generated class for the FilterPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-filter',
  templateUrl: 'filter.html',
  providers : [ProductsProvider, FilterProvider , SearchProvider]
})
export class FilterPage {
  categories;
  searchResult :any;
  searching : boolean;
  brands;
  dataAvailable  ;
  categorySelectd ;
  callBack;
  dataToFilter = {
    category_id : null,
    product_brand  : null  ,
    minPriceSelected : null ,
    maxPriceSelected :  null ,
  }
  brandID;
  categoryID;
  filtered : Boolean;
  filteredData 
  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private _productsService : ProductsProvider,
              private _filterService : FilterProvider,
              private loading : LoadingController,
              public alertCtrl : AlertController,
              private _searchService : SearchProvider,
              private keyboard: Keyboard,
              public event : Events) {
                this.dataAvailable = false;
                this.brandID = this.navParams.get("brandId");
                this.categoryID = this.navParams.get("categoryId");
                this.brandID != null ? this.dataToFilter.product_brand =this.brandID : this.dataToFilter.category_id = this.categoryID;
                this.filtered     = this.navParams.get('filtered');
                this.filteredData = this.navParams.get('fileredData');
                console.log(this.filtered)
                if(this.filtered) {
                    console.log(this.filteredData)
                    this.filteredData.forEach(element => {
                      console.log(element.filters[0].field)
                      if(element.filters[0].field === 'category_id') {
                          this.dataToFilter.category_id = element.filters[0].value;
                      }else if (element.filters[0].field === 'product_brand') {
                        this.dataToFilter.product_brand = element.filters[0].value;
                      }else if (element.filters[0].field === 'price') {
                          if (element.filters[0].condition_type === "gt"){
                            this.dataToFilter.minPriceSelected = element.filters[0].value;
                          }else {
                            this.dataToFilter.maxPriceSelected = element.filters[0].value;
                          }
                      }
                    });
                }
                this.callBack = this.navParams.get('callback');
                this._productsService.getCategories().subscribe((res) => {
                  this.categories = res.children_data ;    
                  this._productsService.getBrandsList().subscribe((brands) => {
                    this.brands = brands;
                    this.dataAvailable = true ;
                  })  
                });
  
  }

  filter = () => {
    this.dataAvailable = false;
    console.log(this.dataToFilter)
    const data = Object.keys(this.dataToFilter).map(key => ({type: key, value: this.dataToFilter[key]}));
    let serarchQuery = "";
    data.forEach((element , index) => {
      if(element.value != null  && element.value != "" ){
        if(element.value === "All"){
          return ;
        }
        if(element.type == "minPriceSelected"){
          serarchQuery += "&searchCriteria[filter_groups]["+index+"][filters]["+index+"][field]=price&searchCriteria[filter_groups]["+index+"][filters]["+index+"][value]="+element.value+"&searchCriteria[filter_groups]["+index+"][filters]["+index+"][condition_type]=gt"
        }else if (element.type == "maxPriceSelected"){
          serarchQuery += "&searchCriteria[filter_groups]["+index+"][filters]["+index+"][field]=price&searchCriteria[filter_groups]["+index+"][filters]["+index+"][value]="+element.value+"&searchCriteria[filter_groups]["+index+"][filters]["+index+"][condition_type]=lt"
        }else {
          serarchQuery += "&searchCriteria[filter_groups]["+index+"][filters]["+index+"][field]="+element.type +"&searchCriteria[filter_groups]["+index+"][filters]["+index+"][value]="+element.value
        }
      }

    });
     this._filterService.get_filtered_products(serarchQuery).subscribe((filtered)=>{
            console.log(filtered)
            this.callBack(filtered).then(()=>{
               this.navCtrl.pop({animate:false});
            });
     });
  }

  reset_filter = () => {

    this.dataToFilter = {
       category_id : null,
       product_brand  : null  ,
       minPriceSelected : null ,
       maxPriceSelected : null ,
    }
    this.event.publish('resetFilter');
    setTimeout(() => {
      this.navCtrl.pop({animate:false});
    }, 300);
  }

  show_price_dialog = () => {
    let alert   = this.alertCtrl.create({
      title  : 'price' ,
      inputs : [
          {
            name : 'minPrice',
            placeholder : 'min',
          },
          {
            name : 'maxPrice',
            placeholder : 'max',
          }
      ],buttons : [
        {
          text : 'Submit',
          handler : data => {
              console.log(data)
              this.dataToFilter.minPriceSelected = data.minPrice;
              this.dataToFilter.maxPriceSelected = data.maxPrice === "" ? null : data.maxPrice;
          }
        },
        {
          text : 'Cancel',
          role : 'cancel'
        }
      ]
    });
    alert.present();
  }

  ionViewDidLoad() {
    $('.searchbar-clear-icon').on('click' , () => {
      this.searching = false ;
      this.keyboard.close();
    }); 
   }

  searchProducts = (searchParam) =>  {
    if(searchParam !== ""){
      this._searchService.filter_products(searchParam).subscribe( (res)=> {
        this.searching = true;
        this.searchResult = res;
        this.keyboard.close();
      })
    }else {
      this.keyboard.close();
      this.searching = false;
    }
  }

  navigateToSingleProduct = (productSKU) => {
    this.navCtrl.push("ProductSinglePage" , {
      "productSKU": productSKU
    },{animate: false})
  }


  back = () => {
    this.navCtrl.pop({animate:false});
  }


}

