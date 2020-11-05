import { NgModule } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

import { LanguageComponent } from './language';
import { IonicModule } from 'ionic-angular'
export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

@NgModule({
  declarations: [
    LanguageComponent,
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
    LanguageComponent
  ],
  entryComponents:[
    LanguageComponent
  ]
})
export class LanguageComponentModule {}

