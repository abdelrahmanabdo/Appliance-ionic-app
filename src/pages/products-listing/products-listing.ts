import { FilterProvider } from './../../providers/filter/filter';
import { WishlistProvider } from '../../providers/wishlist/wishlist';
import { SocialSharing } from '@ionic-native/social-sharing';
import { CartProvider } from '../../providers/cart/cart';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, Toast, ToastController, Events, AlertController, RadioButton } from 'ionic-angular';
import { ProductsProvider} from '../../providers/products/products';
import * as $ from "jquery";
import { constructDependencies } from '@angular/core/src/di/reflective_provider';

/**
 * Generated class for the ProductsListingPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-products-listing',
  templateUrl: 'products-listing.html',
  providers : [ProductsProvider  , SocialSharing , WishlistProvider , CartProvider , FilterProvider]
})
export class ProductsListingPage {
  products ;
  server_base_image_url ="http://www.app-liance.com/pub/media/catalog/product";
  title ;
  rating;
  dataAvilable = false;
  productsCount;
  categoryID ;
  brandID;
  filter;
  searchWith ;
  addWishlistToggle = false;
  removeWishlistToggle = true;
  soryByValue :string = 'newArrival';
  constructor( public navCtrl: NavController,
               public navParams: NavParams  ,  
               public _productsService : ProductsProvider ,
               private socialShare : SocialSharing,
               private _wishlistService : WishlistProvider ,
               private toast : ToastController,
               public loading : LoadingController,
               private _cartService : CartProvider,
               public event :Events , 
               private alert : AlertController,
               private filterService : FilterProvider
              ) {
        this.filter = false ;
        this.event.subscribe('resetFilter', ()=>{
            this.dataAvilable = false;
            this.ngOnInit();
        });
  }

  ngOnInit(): void {
    this.title = this.navParams.get("title"); 
    if(this.navParams.get('brand')){
       this.brandID = this.navParams.get("brandId");
      this._productsService.getBrandProducts(this.brandID).subscribe((brandProducts)=> {
            this.products = brandProducts.items;            
            this.productsCount = this.products.length;
            this.dataAvilable = true ;
          })  
    }else{
      this.categoryID = this.navParams.get('category_id');
      this._productsService.get_categories_products(this.categoryID).subscribe((res)=>{
        this.products = res.items;
        this.productsCount = this.products.length;
        this.searchWith = res.search_criteria.filter_groups;
        this.dataAvilable = true;
       });
    }
  }

  
  navigateToSingleProduct = (productType,productSKU) => {
    if(productType === 'configurable'){
      return  this.navCtrl.push("ConfigurableProductPage" , {
        "productSKU": productSKU
      },{animate: false});
    }
    this.navCtrl.push("ProductSinglePage" , {
      "productSKU": productSKU
    },{animate: false})
  }

  homeAddTocart(sku,Qty=1) {
    this.dataAvilable = false ;
    if(!localStorage.getItem("LoginSession")){
      if(!localStorage.getItem("cartToken")){
        this._cartService.create_guest_cart().subscribe((cartToken)=>{
          localStorage.setItem("cartToken",cartToken.toString());
          this._cartService.add_prdocuts_to_cart(sku).subscribe((res)=>{
            console.log(res)
            if(res) {
              this.event.publish('cartCount');
              this.dataAvilable = true ;
              let alert = this.toast.create({
                message : "Added successfully to Cart",
                duration : 3000 ,
                position : 'top', 
                cssClass : 'toast'
                
              });
              alert.present();
            }
          } , err => this.dataAvilable = true)
        })
      }else {
        this._cartService.add_prdocuts_to_cart(sku).subscribe((res)=>{
          console.log(res)
          if(res) {
            this.event.publish('cartCount');
            this.dataAvilable = true ;
            let alert = this.toast.create({
              message : "Added successfully to Cart",
              duration : 3000 ,
              position : 'top', 
              cssClass : 'toast'
              
            });
            alert.present();
          }
        } , err => this.dataAvilable = true)
      }
  }else{
      this._cartService.get_user_cart().subscribe(res=> {
        this._cartService.add_to_cart(sku,Qty,res.id).subscribe((res)=>
        {
          if(res) {
          this.event.publish('cartCount');
          this.dataAvilable = true ;
          let alert = this.toast.create({
            message : "Added successfully to Cart",
            duration : 3000 ,
            position : 'top', 
            cssClass : 'toast'
          });
          alert.present();
        }
        //  this.addToCartStatus = false;
        } , err => this.dataAvilable = true);
      })
    }

 
  }

  share = ( product_name: string , product_image : string , productSku : string) => {
    productSku = productSku.includes(' ') ? productSku.replace(" ","%20"):productSku
    product_image = product_image !== undefined ? this.server_base_image_url+product_image : '' ;
    this.socialShare.share(product_name , "App-liance App", product_image  ,"https://app-liance.com/index.php/"+product_name+`.html?sku=${productSku}` ).then((res) => {
      console.log(res)
    }).catch(error=>{console.log(error)});
  }


  addToWishlist = (product_id) => {
    this.dataAvilable = false;
    if(!localStorage.getItem("LoginSession")){
      let alert = this.toast.create({
        message : "You have to login first",
        duration : 3000 ,
        position : 'top', 
        cssClass : 'toast'
      });
      this.dataAvilable = true;
      alert.present();
    }else{
      this._wishlistService.add_product_to_Wishlist(product_id).subscribe( (res) => {
        if(res) {
          $('.add-'+product_id).hide();
          $('.remove-'+product_id).removeAttr('hidden');
          this.dataAvilable = true;
          let alert = this.toast.create({
            message : "Added successfully to wishlist",
            duration : 3000 ,
            position : 'top', 
            cssClass : 'toast'
          });
          alert.present();
        }
    })
    }
  }

  callback_func = (filtered) => {
    return new Promise((resolve, reject) => {
      this.filter = true ;
      this.products = filtered.items;
      this.productsCount = filtered.total_count;
      this.searchWith = filtered.search_criteria.filter_groups;
      resolve();
    });
  }

  navigateToFilter = () => {
    this.brandID ? this.navCtrl.push("FilterPage" , {
      callback : this.callback_func, 
      brandId : this.brandID ,
      filtered : this.filter, 
      fileredData : this.searchWith
    },{animate: false}) : this.navCtrl.push("FilterPage" , {
      callback : this.callback_func, 
      categoryId : this.categoryID ,
      filtered : this.filter,
      fileredData : this.searchWith
    },{animate: false});
  }

  sortBy = () => {
      let alert = this.alert.create({
        title : 'Sort By',
            inputs: [{
              type: 'radio',
              label: 'New arrival',
              value : 'newArrival',
              checked : this.soryByValue === 'newArrival'
              
            },{
              type: 'radio',
              label: 'Best selling',
              value : 'bestSelling',
              checked : this.soryByValue === 'bestSelling'

            },{
              type: 'radio',
              label: 'Top Rated',
              value : 'topRated',
              checked : this.soryByValue === 'topRated'
              
            },{
              type: 'radio',
              label: 'Higher Price',
              value : 'higherPrice',
              checked : this.soryByValue === 'higherPrice'

            },{
              type: 'radio',
              label: 'Lower Price',
              value : 'lowerPrice',
              checked : this.soryByValue === 'lowerPrice'
              
              
            },
          ],
          buttons : [        { 
            text : 'Cancel',
            role : 'cancel'
             },{
            text : 'Select',
            handler: (selected) => {
                console.log(selected)
                this.dataAvilable = false ;
                this.soryByValue = selected ;
                this.filterService.sortByfilter(this.categoryID , selected)
                                  .subscribe((filtered)=>{
                                    this.dataAvilable = true ;
                                    this.filter = true ;
                                    this.products = filtered.items;
                                    this.productsCount = filtered.total_count;
                                    this.searchWith = filtered.search_criteria.filter_groups;
                                  })

            }
          }
         ]
      });
      alert.present();
  }

  removeFromWishlist = (product_id) => {
    this.dataAvilable = false ;
    this._wishlistService.get_wishlist(localStorage.getItem("userid")).map((res)=>{
      res.forEach(element => {
        if(element.product_id == product_id){
          this._wishlistService.delete_wishlist(element.wishlist_item_id).subscribe((res) => {
            if(res) {
              $('.add-'+product_id).show();
              $('.remove-'+product_id).attr("hidden","true");
                let toast = this.toast.create({
                  message: "Removed successfully",
                  duration : 3000 ,
                  position : 'top', 
                  cssClass : 'toast'
                });
                toast.present();
                this.dataAvilable = true;
            }
         })
        }
      });
      console.log(res)
    }).subscribe()
  }

  get currency(): any {
    return localStorage.getItem('currency');
  }

  get currencyRate(): any {
    return localStorage.getItem('currencyRate');
  }
  
  back = () => {
    this.navCtrl.pop({animate:false})};
  
  
}
