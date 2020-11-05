import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { MycartPage } from './mycart';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [
    MycartPage,
  ],
  imports: [
    TranslateModule.forChild(),
    IonicPageModule.forChild(MycartPage),
  ],
})
export class MycartPageModule {}
