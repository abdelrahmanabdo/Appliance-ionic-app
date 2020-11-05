import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ProductSinglePage } from './product-single';
import { Ionic2RatingModule } from 'ionic2-rating';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [
    ProductSinglePage,
  ],
  imports: [
    IonicPageModule.forChild(ProductSinglePage),
    Ionic2RatingModule,
    TranslateModule.forChild(),

  ],
})
export class ProductSinglePageModule {}
