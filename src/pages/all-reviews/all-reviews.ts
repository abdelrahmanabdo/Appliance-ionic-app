import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

/**
 * Generated class for the AllReviewsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-all-reviews',
  templateUrl: 'all-reviews.html',
})
export class AllReviewsPage {
  allReviews ;
  rating;
  dataAvilable = false ;
  productImage ; 
  productName ;
  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.allReviews = this.navParams.get('reviewsParam');
    console.log(this.navParams.get('productImage'))
    console.log(this.navParams.get('productName'))

    this.productImage = this.navParams.get('productImage');
    this.productName = this.navParams.get('productName');
    this.dataAvilable = true ;
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AllReviewsPage');
 
  }

  navigateToAddReview = (productId , productName = this.productName , productImage = this.productImage) => {
    this.navCtrl
        .push('AddReviewPage' , {
          productId , 
          productName ,
          productImage
        });
  }
  back = () => {
    this.navCtrl.pop({animate:false});
  }
}
