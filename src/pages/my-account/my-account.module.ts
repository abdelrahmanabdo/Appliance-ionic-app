import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { MyAccountPage } from './my-account';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [
    MyAccountPage,
  ],
  imports: [
    TranslateModule.forChild(),
    IonicPageModule.forChild(MyAccountPage),
  ],
})
export class MyAccountPageModule {}
