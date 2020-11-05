import { CartProvider } from '../../providers/cart/cart';
import { WishlistProvider } from '../../providers/wishlist/wishlist';
import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { IonicPage, NavController, Tabs, Events } from 'ionic-angular';

import { Tab1Root, Tab2Root, Tab3Root  ,Tab4Root } from '..';
import * as $ from "jquery";
import { Tab } from 'ionic-angular/navigation/nav-interfaces';


@IonicPage()
@Component({
  selector: 'page-tabs',
  templateUrl: 'tabs.html'
})

export class TabsPage {
  tab1Root: any = Tab1Root;
  tab2Root: any = Tab2Root;
  tab3Root: any = Tab3Root;
  tab4Root: any = Tab4Root;
  tab1Title = "";
  tab2Title = "";
  tab3Title = "";
  tab4Title = "";
  loggedInUser  = false;
  compareCount  = localStorage.getItem('compareList')   
                                                     ?  JSON.parse(localStorage.getItem('compareList')).length 
                                                     : null ;
  cartCount     = localStorage.getItem('cartCount')     
                                                     ? localStorage.getItem('cartCount') 
                                                     : null ;
  wishlistCount = localStorage.getItem('wishlistCount') 
                                                     ? localStorage.getItem('wishlistCount') 
                                                     : null ;

  constructor(public navCtrl: NavController, 
              public translateService: TranslateService , 
              public event : Events ,
              private _wishlistService : WishlistProvider,
              private _cartService : CartProvider) {

    this.loggedInUser = localStorage.getItem("LoginSession")
                                                            ? true 
                                                            : false ;

    translateService.get(['TAB1_TITLE', 'TAB2_TITLE', 'TAB3_TITLE' , 'TAB4_TITLE']).subscribe(values => {
      console.log(values)
        this.tab1Title = values['TAB1_TITLE'];
        this.tab2Title = values['TAB2_TITLE'];
        this.tab3Title = values['TAB3_TITLE'];
        this.tab4Title = values['TAB4_TITLE'];
    });

    this.event.subscribe('cartCount', action => {
      if(action){
        this.cartCount = null;
        localStorage.removeItem('cartCount')
      }else{
      if(localStorage.getItem('LoginSession')){
        this._cartService.get_cart_items_count()
                         .subscribe((count)=>{
                            this.cartCount = count === 0 
                                                        ? localStorage.removeItem('cartCount') 
                                                        : count ;       
                            localStorage.setItem('cartCount',this.cartCount);  
                          });
      }else {
        this._cartService.get_guest_cart_items_count()
                         .subscribe((count)=>{
                            this.cartCount = count === 0 
                                                        ? localStorage.removeItem('cartCount') 
                                                        : count ;
                            localStorage.setItem('cartCount',this.cartCount);  
                          });
      }
    }

    });

    this.event
        .subscribe('wishlistCount', ()=> {
            this._wishlistService.get_wishlist_info()
                                 .subscribe((count)=>{
                                      this.wishlistCount = count[0].total_items
                                      this.wishlistCount === '0' 
                                                                ? localStorage.removeItem('wishlistCount') 
                                                                : localStorage.setItem('wishlistCount',this.wishlistCount) ;  
                                      this.loggedInUser = true ;
            });
        });

    this.event
        .subscribe('compareCount', () => {
            this.compareCount = localStorage.getItem('compareList') 
                                            ? JSON.parse(localStorage.getItem('compareList')).length 
                                            : 0 ;
          });
  }
}
 