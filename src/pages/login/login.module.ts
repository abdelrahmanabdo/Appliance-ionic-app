import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { IonicPageModule } from 'ionic-angular';
import { UserFacebookComponentModule } from '../../components/user-facebook/user-facebook.module';

import { LoginPage } from './login';

@NgModule({
  declarations: [
    LoginPage,
  ],
  imports: [
    IonicPageModule.forChild(LoginPage),
    TranslateModule.forChild(),
    UserFacebookComponentModule

  ],
  exports: [
    LoginPage
  ]
})
export class LoginPageModule { }
