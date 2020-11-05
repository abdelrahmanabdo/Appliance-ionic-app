import { ReviewsProvider } from './../../providers/reviews/reviews';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController } from 'ionic-angular';
import { TranslateService } from '@ngx-translate/core';

/**
 * Generated class for the AddReviewPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-add-review',
  templateUrl: 'add-review.html',
  providers : [ReviewsProvider]
})
export class AddReviewPage {
  productId;
  productName ;
  productImage ;
  rating: number = 1;
  nickname : string = localStorage.getItem('firstName') 
                                  ? localStorage.getItem('firstName')
                                  : ""  ;
  review : string ;
  dataAvilable  = true ;
  reviewDetails = {
    productId : this.navParams.get('productId'),
    nickname : "" ,
    title : "Review" ,
    detail : "" ,
    storeId : "",
    ratingData : [{
      rating_id : "4",
      ratingCode : "Rating",
      ratingValue : this.rating
    }]
  }
  addReviewMessage : string ;
  constructor(public navCtrl: NavController,
              public navParams: NavParams ,
              private reviewsService : ReviewsProvider ,
              public toast : ToastController ,
              public translate : TranslateService ) {
                this.productName = this.navParams.get('productName');
                this.productImage = this.navParams.get('productImage');
  }

  ionViewDidLoad() {
  }


  addReview = () => {
    this.dataAvilable = false ;
    this.reviewDetails.detail    = this.review ;
    this.reviewDetails.nickname    = this.nickname ;
    this.reviewDetails.ratingData[0].ratingValue = this.rating ;
    this.translate.get('add review message').subscribe((message)=>{
      this.addReviewMessage = message ;
    });
    return this.reviewsService.addProductReview(this.reviewDetails)
                              .subscribe((result)=>{
                                console.log(result)
                                if(result[0].status){
                                  let toast = this.toast.create({
                                    message : this.addReviewMessage,
                                    duration : 3000
                                  });
                                  this.dataAvilable = true ;
                                  toast.present();
                                  this.navCtrl.pop({animate:false});
                                }
                              });
  }

  get isLoggedIn ()  {
    return localStorage.getItem('LoginSession');
  }

  back = () => {
    this.navCtrl
        .pop();
  }
}
