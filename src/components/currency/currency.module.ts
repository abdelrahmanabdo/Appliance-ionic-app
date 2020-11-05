import { NgModule } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { IonicModule } from 'ionic-angular'
import { CurrencyComponent} from './currency'
export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

@NgModule({
  declarations: [
    CurrencyComponent,
   ],
  imports: [
    TranslateModule.forChild({
      loader: {
           provide: TranslateLoader,
           useFactory: (createTranslateLoader),
           deps: [HttpClient]
         }
      }), //For lazy loading
      IonicModule,

  ],
  exports: [  
    CurrencyComponent
  ],
  entryComponents:[
    CurrencyComponent
  ]
})
export class CurrencyComponentModule {}

