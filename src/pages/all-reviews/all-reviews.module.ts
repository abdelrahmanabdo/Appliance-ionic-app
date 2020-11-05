import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AllReviewsPage } from './all-reviews';
import { Ionic2RatingModule } from 'ionic2-rating';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [
    AllReviewsPage,
  ],
  imports: [
    TranslateModule.forChild(),  
	IonicPageModule.forChild(AllReviewsPage),
	Ionic2RatingModule
  ],
})
export class AllReviewsPageModule {}
