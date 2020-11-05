import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PayfortPaymentPage } from './payfort-payment';
import { FormsModule }   from '@angular/forms';

@NgModule({
  declarations: [
    PayfortPaymentPage,
  ],
  imports: [
    IonicPageModule.forChild(PayfortPaymentPage),
    FormsModule
  ],
})
export class PayfortPaymentPageModule {}
