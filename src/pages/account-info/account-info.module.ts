import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AccountInfoPage } from './account-info';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [
    AccountInfoPage,
  ],
  imports: [
    TranslateModule.forChild(),
    IonicPageModule.forChild(AccountInfoPage),
  ],
})
export class AccountInfoPageModule {}
