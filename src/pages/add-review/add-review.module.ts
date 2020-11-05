import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AddReviewPage } from './add-review';
import { TranslateModule } from '@ngx-translate/core';
import { Ionic2RatingModule } from 'ionic2-rating';

@NgModule({
  declarations: [
    AddReviewPage,
  ],
  imports: [
    Ionic2RatingModule,
    TranslateModule,
    IonicPageModule.forChild(AddReviewPage),
  ],
})
export class AddReviewPageModule {}
