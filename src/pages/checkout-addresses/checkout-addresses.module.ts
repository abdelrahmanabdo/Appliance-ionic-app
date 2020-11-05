import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CheckoutAddressesPage } from './checkout-addresses';

@NgModule({
  declarations: [
    CheckoutAddressesPage,
  ],
  imports: [
    IonicPageModule.forChild(CheckoutAddressesPage),
  ],
})
export class CheckoutAddressesPageModule {}
