import { CartProvider } from '../../providers/cart/cart';
import { ProductsProvider } from '../../providers/products/products';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Events, ToastController } from 'ionic-angular';

/**
 * Generated class for the ComparePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-compare',
  templateUrl: 'compare.html',
  providers:[ProductsProvider , CartProvider]
})
export class ComparePage {
  comapreList;
  public list = [] ;
  dataAvilable =false;
  server_base_image_url ="https://app-liance.com/pub/media/catalog/product";  
  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private _productService : ProductsProvider  ,
              public event : Events , 
              private _cartService : CartProvider , 
              public toast : ToastController
          ) {
  
  }

  ionViewWillEnter(){
    this.list=[];
    this.dataAvilable = false;
    if(!localStorage.getItem("compareList")){
      this.list = [];
      this.dataAvilable = true;
      console.log('no')
    }else{
      console.log("yes")
      this.comapreList = JSON.parse(localStorage.getItem("compareList"));
      this.comapreList.forEach(element => {
            this._productService.get_prodcut_by_sku(element)
                                .subscribe((compare)=>{
                                  console.log(compare)
                                    this.list.push(compare) ;
                                    this.dataAvilable = true;
                                })
      });
    }
  }

  removeFromCompare = (index) =>{
      if(this.comapreList.length == 1 ){
        localStorage.removeItem("compareList");
        this.list = [];
      }else{
        this.comapreList.splice(index,1);
        localStorage.setItem("compareList",JSON.stringify(this.comapreList));
        this.list.splice(index,1);
      }
      this.event.publish('compareCount');
  }

  viewProduct (sku) {
    this.navCtrl.push("ProductSinglePage",{'productSKU':sku},{animate: false})
  }

  AddTocart = (sku , Qty) =>{
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
          },   
          error => this.dataAvilable = true)
        },   
        error => this.dataAvilable = true)
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
        })
      }
  }else{
      this._cartService.get_user_cart().subscribe(res=> {
        this._cartService.add_to_cart(sku , Qty,res.id).subscribe((res)=>
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
        },   
        error => this.dataAvilable = true);
      })
    }
  }



  get currency(): any {
    return localStorage.getItem('currency');
  }

  get currencyRate(): any {
    return localStorage.getItem('currencyRate');
  }

  back = () => {
    this.navCtrl.push("TabsPage",{animate:false})
  }
}
