import { NgModule } from '@angular/core';
import { CurrencyComponent } from './currency/currency';
import { LanguageComponent } from './language/language';
import { IonicModule } from 'ionic-angular';
import { MenuListComponent } from './menu-list/menu-list';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { HttpClient } from '@angular/common/http';

export function createTranslateLoader(http: HttpClient) {
	return new TranslateHttpLoader(http, './assets/i18n/', '.json');
  }
  
@NgModule({
	declarations: [],
	imports: [
		IonicModule,
	    TranslateModule.forChild({
			loader: {
				 provide: TranslateLoader,
				 useFactory: (createTranslateLoader),
				 deps: [HttpClient]
			   }
			}), //For lazy loading
	],
	exports: [
	
	]
})
export class ComponentsModule {}
