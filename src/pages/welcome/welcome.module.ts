import { UserFacebookComponentModule } from '../../components/user-facebook/user-facebook.module';
import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { IonicPageModule } from 'ionic-angular';

import { WelcomePage } from './welcome';

@NgModule({
  declarations: [
    WelcomePage,
  ],
  imports: [
    IonicPageModule.forChild(WelcomePage),
    TranslateModule.forChild(),
    UserFacebookComponentModule

  ],
  exports: [
    WelcomePage
  ]
})
export class WelcomePageModule { }
