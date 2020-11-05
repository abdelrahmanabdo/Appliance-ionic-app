import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ProductsListingPage } from './products-listing';
import { Ionic2RatingModule } from "ionic2-rating";
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [
    ProductsListingPage,
  ],
  imports: [
    IonicPageModule.forChild(ProductsListingPage),
    Ionic2RatingModule,
    TranslateModule.forChild(),


  ],
})
export class ProductsListingPageModule {}
