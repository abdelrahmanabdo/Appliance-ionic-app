import { CartProvider } from '../../providers/cart/cart';
import { CheckoutPage } from '../checkout/checkout';
import { CheckoutProvider } from '../../providers/checkout/checkout';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, ToastController, AlertController, Events } from 'ionic-angular';
import { ProductsProvider } from '../../providers/products/products';
import * as $ from "jquery";

/**
 * Generated class for the MycartPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-mycart',
  templateUrl: 'mycart.html',
  providers: [ProductsProvider, CheckoutProvider, CartProvider]
})

export class MycartPage {
  server_base_image_url;
  items;
  showCheckout = true;
  showItems;
  totals;
  updateCartFlag;
  updatedQty: number;
  dataAvaliable = false;
  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public loading: LoadingController,
    public toast: ToastController,
    public alert: AlertController,
    public _productService: ProductsProvider,
    private _checkoutService: CheckoutProvider,
    private _cartService: CartProvider,
    public event: Events
  ) {
    this.server_base_image_url = "https://app-liance.com/pub/media/catalog/product";

  }

  async ionViewWillEnter() {
    this.dataAvaliable = false;
    this.updateCartFlag = false;
    if (!localStorage.getItem("LoginSession")) {
      if (!localStorage.getItem("cartToken")) {
        await this._cartService.create_guest_cart().subscribe((token) => {
          localStorage.setItem("cartToken", token.toString());
          this.get_guest_user_cart();
        });
      } else {
        this.get_guest_user_cart();
      }
    } else {
      this.get_logged_in_user_cart();
    }
  }


  removeFromCart = (id, index) => {
    let alert = this.alert.create({
      message: "Are you sure ?",
      buttons: [{
        text: 'Cancel',
        role: 'cancel'
      }, {
        text: "Delete",
        handler: () => {

          this.dataAvaliable = false;
          if (!localStorage.getItem("LoginSession")) {
            this._cartService.remove_from_guest_cart(id).subscribe((res) => {
              if (res) {
                if (this.items.length == 1) {
                  this.showItems = true;
                  this.items = [];
                  this.dataAvaliable = true;
                  localStorage.removeItem('cartCount')
                } else {
                  this._cartService.get_guest_cart_totals().subscribe((total) => {
                    this.totals = total;
                    this.items.splice(index, 1);
                    this.dataAvaliable = true;
                    let toast = this.toast.create({
                      message: "Item deleted successfully",
                      duration: 3000,
                      position: 'top',
                      cssClass: 'toast'
                    });
                    toast.present();
                    this.event.publish('cartCount');
                  },
                    error => this.dataAvaliable = true);
                }

              }
            }
              ,
              error => this.dataAvaliable = true)
          } else {
            this._cartService.remove_from_cart(id).subscribe((res) => {
              if (res == true) {
                if (this.items.length == 1) {
                  this.showItems = true;
                  this.items = [];
                  this.dataAvaliable = true;
                } else {
                  this._cartService.get_cart_totals().subscribe((total) => {
                    this.totals = total;
                    this.items.splice(index, 1);
                  });
                  this.dataAvaliable = true;
                  let toast = this.toast.create({
                    message: "Item deleted successfully",
                    duration: 3000,
                    position: 'top',
                    cssClass: 'toast'
                  });
                  toast.present();
                }
                this.event.publish('cartCount');
              }

            })
          }
        }
      }]
    });
    alert.present();
  }

  get_guest_user_cart() {
    this._cartService.get_guest_cart().subscribe((res) => {
      this._cartService.get_guest_cart_totals().subscribe((total) => {
        this.totals = total;
        this.items = res.items;
        if (this.items.length) {
          this.showItems = false;
          this.dataAvaliable = true;
          this.showCheckout = false;
        } else {
          this.dataAvaliable = true;
          this.showItems = true;
        }
      })
    });
  }


  get_logged_in_user_cart = () => {
    this._cartService.get_user_cart().subscribe(res => {
      this._cartService.get_cart_totals().subscribe((total) => {
        this.totals = total;
        this.items = res.items;
        if (this.items.length) {
          this.showItems = false;
          this.dataAvaliable = true;
          this.showCheckout = false;
        } else {
          this.dataAvaliable = true;
          this.showItems = true;
        }
      },
        error => this.dataAvaliable = true)
    },
      error => this.dataAvaliable = true)
  }

  updateCart = (item, image, index) => {
    this.dataAvaliable = false;
    if (!localStorage.getItem("LoginSession")) {
      this._cartService.update_guest_Cart(item, image , item.quote_id).subscribe((res) => {
        this.items[index] = res;
        this._cartService.get_guest_cart_totals().subscribe((total) => {
          this.totals = total;
          this.dataAvaliable = true;
          let toast = this.toast.create({
            message: "Item updated successfully",
            duration: 3000,
            position: 'top',
            cssClass: 'toast'
          });
          toast.present();
        });
      })

    } else {

      this._cartService.updateCart(item, image).subscribe((res) => {
        this.items[index] = res;
        this._cartService.get_cart_totals().subscribe((total) => {
          this.totals = total;
          this.dataAvaliable = true;
          let toast = this.toast.create({
            message: "Item updated successfully",
            duration: 3000,
            position: 'top',
            cssClass: 'toast'
          });
          toast.present();
        });
      })
    }
  }

  increaseQuantity = (item, index) => {
    var element = $('#quantity-' + item.item_id);
    var qty = element.html();
    qty = +qty;
    qty += 1;
    element.html(qty);
    item.qty = qty;
    const image = item.image;
    delete item.image;
    this.updateCart(item, image, index);

  }

  decreaseQuantity = (item, index) => {
    if (item.qty !== 1) {
      var element = $('#quantity-' + item.item_id );
      var qty = element.html();
      qty = +qty;
      qty -= 1;
      element.html(qty);
      item.qty = qty;
      const image = item.image;
      delete item.image;
      this.updateCart(item, image, index);
    } else {
      return ;
    }
  }

  /**
   * Navigate to checkout screen
   * 
   */
  checkout() {
    this.navCtrl.push("CheckoutPage", { animate: false });
  }

  get currency(): any {
    return localStorage.getItem('currency');
  }

  get currencyRate(): any {
    return localStorage.getItem('currencyRate');
  }

  back = () => {
    this.navCtrl.push("TabsPage", { animate: false });
  }
}
