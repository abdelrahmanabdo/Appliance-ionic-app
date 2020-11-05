import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ComparePage } from './compare';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [
    ComparePage,
  ],
  imports: [
    TranslateModule.forChild(),
    IonicPageModule.forChild(ComparePage),
  ],
})
export class ComparePageModule {}
