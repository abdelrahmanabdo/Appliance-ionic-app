import { LanguageComponentModule } from '../language/language.module';
import { LanguageComponent } from '../language/language';
import { NgModule } from '@angular/core';
import { IonicModule } from 'ionic-angular';
import { MenuListComponent } from './menu-list';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { HttpClientModule,HttpClient } from '@angular/common/http';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { CurrencyComponentModule } from '../currency/currency.module';

@NgModule({
  declarations: [
    MenuListComponent
   ],
  imports: [
    IonicModule,
    TranslateModule.forRoot({
      loader: {
           provide: TranslateLoader,
           useFactory: (createTranslateLoader),
           deps: [HttpClient]
         }
      }),
      LanguageComponentModule , 
      CurrencyComponentModule

  ],
  exports: [
    MenuListComponent
  ],
  entryComponents:[
    MenuListComponent
  ]
})
export class MenuListComponentModule {}

export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

