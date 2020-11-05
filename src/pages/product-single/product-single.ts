import { AddReviewPage } from './../add-review/add-review';
import { CartProvider } from '../../providers/cart/cart';
import { ReviewsProvider } from '../../providers/reviews/reviews';
import { WishlistProvider } from '../../providers/wishlist/wishlist';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, ToastController, Events } from 'ionic-angular';
import { ProductsProvider} from '../../providers/products/products';
import { Ionic2RatingModule } from 'ionic2-rating';
import { SocialSharing } from '@ionic-native/social-sharing';
import * as $ from "jquery";

/**
 * Generated class for the ProductSinglePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-product-single',
  templateUrl: 'product-single.html',
  providers : [ProductsProvider ,SocialSharing, WishlistProvider,CartProvider]
})
export class ProductSinglePage {
  product ; 
  Qty;
  product_image = "/assets/imgs/product_large.jpg";
  product_description = "";
  addToCartStatus   = true;
  server_base_image_url ="https://app-liance.com/pub/media/catalog/product";  
  reviews ;
  rating ;
  productSKU;
  productName;
  relatedProducts = [] ;
  dataAvilable = false ;
  isThereSale = false;
  saleValue ;
  removeWishlistToggle = true;
  fromWishlist = false ;
  constructor(public navCtrl: NavController ,
              public navParams: NavParams ,
              public _cartService  :CartProvider,
              public loading : LoadingController,
              private _wishlistService : WishlistProvider,
              private _reviewsService : ReviewsProvider,
              private _productService : ProductsProvider,
              public toast : ToastController,
              private socialShare : SocialSharing,
              public event : Events

           ) {
             
              this.productSKU = this.navParams.get('sku') ? this.navParams.get('sku') : this.navParams.get('productSKU');
              this.productSKU = this.productSKU.includes('%20') ? this.productSKU.replace(/%20/g , " ") : this.productSKU ;
              this.fromWishlist = this.navParams.get('isFromWishlistPage') ;
              this.getProduct(this.productSKU);                          
    } 


  getProduct = (productSku) => {
    this._productService.get_prodcut_by_sku(productSku)
                        .subscribe((res)=>{
                                 this.product = res;
                                //  if(this.navParams.get('isFromWishlistPage')){
                                //      $('.addwishlist').hide();
                                //      $('.removewishl').removeAttr('hidden'); 
                                //   };
                                    this._reviewsService.get_product_reviews(this.product.id).subscribe((res)=>{
                                      this.reviews = res[0].reviews;
                                      this.rating = (res[0].avg_rating_percent / 100) * 5;
                                      this.dataAvilable = true;
                                  });
                                  this.product.custom_attributes.forEach(element => {
                                    if (element.attribute_code === "description") {
                                      this.product_description = element.value ;
                                    }else if (element.attribute_code == "special_price" && element.value !== this.product.price)
                                    {
                                      console.log(element)
                                        this.isThereSale = true ;
                                        this.saleValue   = element.value;
                                    }
                                  });
                                  if(this.product.product_links.length > 0) {
                                    this.product.product_links.forEach(element => {
                                      if(element.link_type == "related") {
                                          this._productService.get_prodcut_by_sku(element.linked_product_sku).subscribe((res)=>{
                                          this.relatedProducts.push(res);
                                          });
                                      }
                                    });
                                  }
                        });
  }

  homeAddTocart(sku,Qty) {
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
          },err => this.dataAvilable = true)
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
        },err => this.dataAvilable = true)
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
        },err => this.dataAvilable = true);
      })
    }

 
  }


  addToWishlist  = (product_id) => {
    this.dataAvilable = false ;
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
          this.event.publish('wishlistCount');

        }
    })
    }
  }

  removeFromWishlist = (product_id) => {
    this.dataAvilable = false ;
    this.event.publish('wishlistCount');
    this._wishlistService.get_wishlist(localStorage.getItem("userid")).map((res)=>{
      if(res.length === 0){
          
      }else{
          res.forEach(element => {
            if(element.product_id == product_id){
              this._wishlistService.delete_wishlist(element.wishlist_item_id).subscribe((res) => {
                if(res) {
                  if(this.navParams.get('isFromWishlistPage')){
                    $('.add-'+product_id).removeAttr("hidden");
                  }
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
        }
      console.log(res)
    }).subscribe();
    
  }

  Go_to_all_reviews = (reviews , productName , productImage) => {
    this.navCtrl.push("AllReviewsPage",{
      reviewsParam : reviews ,
      productName ,
      productImage
    },{animate: false});
  }


  compare = (productSKU) => {
      if(!localStorage.getItem("compareList")){
        let comapre = [];
        comapre.push(productSKU);
        localStorage.setItem("compareList",JSON.stringify(comapre));
        let toast = this.toast.create({
          message: "Added successfully to compare",
          duration :2500 ,
          position : 'top', 
          cssClass : 'toast'
        });
        toast.present();
        this.event.publish('compareCount');

      }else {
        
        let comapre = JSON.parse(localStorage.getItem("compareList"));
        if(comapre.length === 4 ) {
          let toast = this.toast.create({
            message: "Sorry maximun number is 4 products",
            duration :2500 ,
            position : 'top', 
            cssClass : 'toast'
          });
          toast.present();
        }else if (comapre.indexOf(productSKU) !== -1){
          let toast = this.toast.create({
            message: "The product already exists",
            duration :2500 ,
            position : 'top', 
            cssClass : 'toast'
          });
          toast.present();
        }
        else{
          comapre.push(productSKU);
          localStorage.setItem("compareList",JSON.stringify(comapre));
          let toast = this.toast.create({
            message: "Added successfully to compare",
            duration :2500 ,
            position : 'top', 
            cssClass : 'toast'
          });
          toast.present();
          this.event.publish('compareCount');

        }

      }
  }

  GoToProductPage = (relatedProduct) => {
    this.navCtrl.push("ProductSinglePage", {
      productSKU : relatedProduct
    },{animate: false})
  }

  share = ( product_name: string , product_image : string , productSku : string) => {
    productSku = productSku.includes(' ') ? productSku.replace(" ","%20"):productSku
    product_image = product_image !== undefined ? this.server_base_image_url+product_image : '' ;
    this.socialShare.share(product_name , "App-liance App", product_image  ,"https://app-liance.com/index.php/"+product_name+`.html?sku=${productSku}` ).then((res) => {
      console.log(res)
    }).catch(error=>{console.log(error)});
  }


  navigateToAddReview = (productId , productName , productImage) => {
    this.navCtrl
        .push('AddReviewPage' , {
          productId , 
          productName ,
          productImage
        });
  }


  get currency(): any {
    return localStorage.getItem('currency');
  }

  get currencyRate(): any {
    return localStorage.getItem('currencyRate');
  }
  
  back = () => {
    if(this.navCtrl.length() > 1){
      this.navCtrl.pop({animate:false});
    }else {
      this.navCtrl.push('TabsPage',{animate: false});
    }
  }
  
}
