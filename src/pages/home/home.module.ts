import { TranslateModule } from '@ngx-translate/core';
import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { HomePage } from './home';
import { Ionic2RatingModule } from "ionic2-rating";


@NgModule({
  declarations: [
    HomePage,
  ],
  imports: [
    TranslateModule.forChild(),
	IonicPageModule.forChild(HomePage),
	  Ionic2RatingModule
  ],
})
export class HomePageModule {}
