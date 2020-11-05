import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { MyOrdersPage } from './my-orders';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [
    MyOrdersPage,
  ],
  imports: [
    TranslateModule.forChild(),
    IonicPageModule.forChild(MyOrdersPage),
  ],
})
export class MyOrdersPageModule {}
