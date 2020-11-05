import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { MyAddressesPage } from './my-addresses';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [
    MyAddressesPage,
  ],
  imports: [
    TranslateModule.forChild(),
    IonicPageModule.forChild(MyAddressesPage),
  ],
})
export class MyAddressesPageModule {}
