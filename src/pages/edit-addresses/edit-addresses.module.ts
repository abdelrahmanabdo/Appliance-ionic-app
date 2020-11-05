import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { EditAddressesPage } from './edit-addresses';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [
    EditAddressesPage,
  ],
  imports: [
    IonicPageModule.forChild(EditAddressesPage),
    TranslateModule.forChild(),

  ],
})
export class EditAddressesPageModule {}
