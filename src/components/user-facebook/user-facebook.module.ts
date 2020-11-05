import { NgModule } from '@angular/core';
import { IonicModule } from 'ionic-angular';

import { UserFacebookComponent } from './user-facebook';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
	declarations: [UserFacebookComponent],
	imports: [ 
        IonicModule,
        TranslateModule.forChild(),
    ],
	exports: [
        UserFacebookComponent
    ],
    entryComponents:[
        UserFacebookComponent
    ]
})
export class UserFacebookComponentModule {}
