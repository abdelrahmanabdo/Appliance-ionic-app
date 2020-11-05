import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

/**
 * Generated class for the OrderDetailsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-order-details',
  templateUrl: 'order-details.html',
})
export class OrderDetailsPage {
  orderDetails ; 
  rating ;
  review ;
  dataAvaliable = false ;
  server_base_image_url;

  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.server_base_image_url  = "https://app-liance.com/pub/media/catalog/product";
      this.orderDetails = this.navParams.get("orderParam");
      this.dataAvaliable = true ;
  }

  onRatingChange = (value)=>{
    console.log(value)
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

  ionViewDidLoad() {
    console.log('ionViewDidLoad OrderDetailsPage');
  }

  back = () => {
    this.navCtrl.pop({animate:false});
  }
}
