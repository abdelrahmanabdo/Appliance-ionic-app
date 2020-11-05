import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { MyWishlistPage } from './my-wishlist';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [
    MyWishlistPage,
  ],
  imports: [
    TranslateModule.forChild(),

    IonicPageModule.forChild(MyWishlistPage),
  ],
})
export class MyWishlistPageModule {}
