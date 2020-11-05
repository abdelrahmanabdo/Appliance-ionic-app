import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PayTabsPage } from './pay-tabs';

@NgModule({
  declarations: [
    PayTabsPage,
  ],
  imports: [
    IonicPageModule.forChild(PayTabsPage),
  ],
})
export class PayTabsPageModule {}
