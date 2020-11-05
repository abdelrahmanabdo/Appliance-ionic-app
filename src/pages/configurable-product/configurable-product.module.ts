import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ConfigurableProductPage } from './configurable-product';
import { Ionic2RatingModule } from 'ionic2-rating';
import { TranslateModule } from '@ngx-translate/core';
@NgModule({
  declarations: [
    ConfigurableProductPage,
  ],
  imports: [
    IonicPageModule.forChild(ConfigurableProductPage),
    Ionic2RatingModule,
    TranslateModule.forChild(),
  ],
})
export class ConfigurableProductPageModule {}
