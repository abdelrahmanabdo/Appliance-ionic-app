import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AddAddressesPage } from './add-addresses';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [
    AddAddressesPage,
  ],
  imports: [
    TranslateModule.forChild(),
    IonicPageModule.forChild(AddAddressesPage),
  ],
})
export class AddAddressesPageModule {}
