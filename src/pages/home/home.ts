import { IproductModel } from '../../models/IproductModel.model';
import { WishlistProvider } from '../../providers/wishlist/wishlist';
import { ProductsProvider } from '../../providers/products/products';
import { SearchProvider } from '../../providers/search/search';
import { CartProvider } from '../../providers/cart/cart';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, AlertController, ToastController, MenuController, Events } from 'ionic-angular';
import * as $ from "jquery";
import { SocialSharing } from '@ionic-native/social-sharing';
import { AuthProvider } from '../../providers/auth/auth';
import { Platform } from 'ionic-angular/platform/platform';
import { Keyboard } from '@ionic-native/keyboard';

/**
 * Generated class for the HomePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
  providers : [SearchProvider , ProductsProvider , SocialSharing , WishlistProvider,CartProvider ,AuthProvider]
})
export class HomePage {
  server_base_image_url ="https://app-liance.com/pub/media/catalog/product";  
  categories_server_url = "https://www.app-liance.com/pub/media/catalog/category/";
  brands_server_url     = "https://www.app-liance.com/pub/media/";
  searchResult :any;
  searching : boolean;
  featured  : boolean ;
  newArrival : boolean ;
  topSelling : boolean;
  feateuredProducts :IproductModel;
  newArrivalProducts : IproductModel;
  topSellingProducts : IproductModel;
  message : string ;
  rating;
  categories = null;
  brands;
  addWishlistToggle = false ;
  removeWishlistToggle = true;
  
  dataAvilable  ;
  constructor(public navCtrl: NavController,
              public platform : Platform,
              public navParams: NavParams ,
              private _searchService : SearchProvider,
              private _productsService : ProductsProvider,
              public loading : LoadingController,
              private socialShare : SocialSharing,
              private _wishlistService : WishlistProvider ,
              private _cartService : CartProvider,
              private _AuthProvider : AuthProvider,
              public menu : MenuController,
              public event : Events,
              private keyboard: Keyboard,
              public toast : ToastController,
              public alert : AlertController
            ) {
                this.menu.swipeEnable(false);
                this.dataAvilable = false ;
               
  }

 async ngOnInit() {

      await this._productsService.getCategories().subscribe((res) => {
        res.children_data.forEach(element => {
          this._productsService.get_category_by_id(element.id).subscribe((category)=>{
            for(var i = 0 ; i < category.custom_attributes.length ; i++) {
              if(category.custom_attributes[i].attribute_code === "image" ) {
                console.log(category.custom_attributes[i].value)
                element.image = this.categories_server_url+category.custom_attributes[i].value ;
                break;
              }else {
                element.image = "assets/imgs/card-1.jpg";
              }
            }
          });
        });
        this.categories = res.children_data ;
      },   
      error => this.dataAvilable = true);

      await  this._productsService.get_featured_products().subscribe( (featured ) => {
          this.feateuredProducts = featured;
          console.log(this.feateuredProducts)
      },   
      error => this.dataAvilable = true)
      await  this._productsService.get_new_products().subscribe((newProducts) => {
        this.newArrivalProducts = newProducts;
        this.dataAvilable = true;
        console.log(this.newArrivalProducts)

      },   
      error => this.dataAvilable = true)
      await  this._productsService.get_bestSeller_products().subscribe((topSellingproduct) => {
        this.topSellingProducts = topSellingproduct;
      },   
      error => this.dataAvilable = true)
      await  this._productsService.getBrandsList().subscribe((brands) => {
        this.brands = brands;
      },   
      error => this.dataAvilable = true)
      
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
        this.searching = false;
        this.keyboard.close();
      }
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

  addToWishlist = ($event,product_id) => {
    // $event.srcElement.childNodes[1].data = "Added";
    // $event.srcElement.style.color = 'red';
    // $event.srcElement.childNodes[0].style.color = "red";
    // $event.srcElement.outerHTML = '<button (tap)="removeFromWishlist(product.id )" [hidden]="removeWishlistToggle"><span class="icon-heart" translate="remove_from_wishlist" ></span></button>'
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
          this.event.publish('wishlistCount');
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
    },   
    error => this.dataAvilable = true)
    }

  }

  removeFromWishlist = (product_id) => {
    this.dataAvilable = false ;
    this._wishlistService.get_wishlist(localStorage.getItem("userid")).map((res)=>{
      res.forEach(element => {
        if(element.product_id == product_id){
          this._wishlistService.delete_wishlist(element.wishlist_item_id).subscribe((res) => {
            if(res) {
              this.event.publish('wishlistCount');
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
         },   
         error => this.dataAvilable = true)
        }
      });
      console.log(res)
    }).subscribe( 
      error => this.dataAvilable = true)
    
  }

  navigateToBrandProducts = (brandName , brandId) => {
    this.navCtrl.push("ProductsListingPage", {
      title : brandName,
      brand : true, 
      brandId : brandId
    },{animate: false});
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

  GoToCategoriesList = (categoryID,categoryName) => {
    this.navCtrl.push("ProductsListingPage" , {
      "category_id" : categoryID,
      "title":categoryName,
      "brand": false
    },{animate: false})
  }

  get currency(): any {
    return localStorage.getItem('currency');
  }

  get currencyRate(): any {
    return localStorage.getItem('currencyRate');
  }
}
