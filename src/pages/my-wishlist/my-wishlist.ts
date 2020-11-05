import { ProductSinglePage } from '../product-single/product-single';
import { ProductsProvider } from '../../providers/products/products';
import { WishlistProvider } from '../../providers/wishlist/wishlist';
import { CartProvider } from '../../providers/cart/cart';

import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, LoadingController, Events } from 'ionic-angular';
import { Subscriber } from 'rxjs/Subscriber';

/**
 * Generated class for the MyWishlistPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-my-wishlist',
  templateUrl: 'my-wishlist.html',
  providers : [WishlistProvider , ProductsProvider,CartProvider]
}) 
export class MyWishlistPage {
  wishlist;
  server_base_image_url ="http://www.app-liance.com/pub/media/catalog/product";  
  dataAvaliable = false ;
  constructor(public navCtrl: NavController, 
              public navParams: NavParams , 
              private toast : ToastController ,
              private _wishlistService : WishlistProvider,
              public loading : LoadingController,
              private _productsService : ProductsProvider,
              private _cartService : CartProvider,
              public event : Events) {

  }

  ionViewWillEnter = () => {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this._wishlistService.get_wishlist(localStorage.getItem("userid")).subscribe((res) => {
      this.wishlist = res ;
      this.dataAvaliable = true ;
      console.log(this.wishlist)
    },   
    error => this.dataAvaliable = true)

  }


  removeFromWishlist = (id , index) => {
    this._wishlistService.delete_wishlist(id).subscribe((res) => {
      if(res) {
          this.wishlist.splice(index, 1)
          let toast = this.toast.create({
            message: "Deleted successfully",
            duration : 3000 ,
            position : 'top', 
            cssClass : 'toast'
          });
          toast.present();
          this.event.publish('wishlistCount');
      }
  })
  }
  
  wishlistAddTocart = (sku) => {
    this.dataAvaliable = false ;
    this._cartService.get_user_cart().subscribe(res=> {
      this._cartService.add_to_cart(sku,1,res.id).subscribe((res)=>
      {
       if(res) {
        this.dataAvaliable = true ;
        this.event.publish('cartCount');         
        let alert = this.toast.create({
          message : "Added successfully to Cart",
          duration : 3000 ,
          position : 'top', 
          cssClass : 'toast'
          
        });
        alert.present();
      }
      //  this.addToCartStatus = false;
      },err => this.dataAvaliable = true);
    },   
    error => this.dataAvaliable = true)
  }
 
  viewProduct = (productSKU) => {
    this.navCtrl.push("ProductSinglePage" ,{
      "productSKU" : productSKU ,
      "isFromWishlistPage": true
    },{animate: false})
  }

  get currency(): any {
    return localStorage.getItem('currency');
  }

  get currencyRate(): any {
    return localStorage.getItem('currencyRate');
  }
  
  back = () => {
    if(this.navCtrl.length() === 1){
      this.navCtrl.setRoot("TabsPage",{animate:false});

    }else {
      console.log(this.navCtrl.length())
      this.navCtrl.pop({animate:false});

    }
  }
}

