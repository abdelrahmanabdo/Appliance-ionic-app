import { OrderDetailsPage } from '../order-details/order-details';
import { Subscriber } from 'rxjs/Subscriber';
import { ProductsProvider } from '../../providers/products/products';
import { OrdersProvider } from '../../providers/orders/orders';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController } from 'ionic-angular';

/**
 * Generated class for the MyOrdersPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-my-orders',
  templateUrl: 'my-orders.html',
  providers:[OrdersProvider , ProductsProvider]
})
export class MyOrdersPage {
  orders ;
  totalOrdersNumber ; 
  dataAvaliable = false ;
  server_base_image_url;
  constructor(public navCtrl: NavController ,
              public navParams: NavParams , 
              public loading : LoadingController,
              private _ordersService : OrdersProvider, 
              private _productsService : ProductsProvider) {
              this.server_base_image_url  = "https://app-liance.com/pub/media/catalog/product";
              this._ordersService.get_user_orders().subscribe((orders) => {
                console.log(orders)
                this.orders = orders.items;
                this.totalOrdersNumber = orders.total_count;
                this.dataAvaliable = true ;
              })
    }


  viewOrder = (order) => {
    this.navCtrl.push("OrderDetailsPage", {
      "orderParam" : order
    },{animate: false});
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad MyOrdersPage');
  }

  back = () => {
    this.navCtrl.pop({animate:false});
  }
  
}
