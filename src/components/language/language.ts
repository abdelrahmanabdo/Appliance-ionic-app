import { ILanguageModel } from '../../models/ILanguageModel.model';
import { Component, NgZone, ViewChild } from '@angular/core';
import { TranslateService, LangChangeEvent } from '@ngx-translate/core';
import { Platform, App, Events, NavController, Nav } from 'ionic-angular';
import {LanguageServiceProvider} from '../../providers/language-service/language-service'
/**
 * Generated class for the LanguageComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'language',
  templateUrl: 'language.html'
})
export class LanguageComponent {
  @ViewChild(Nav) nav: Nav;
  languageSelected;
  languages : Array<ILanguageModel>;
  currentLanguage : string;
  text: string;

  constructor(public platform: Platform,
    public translate: TranslateService,
    public languageService: LanguageServiceProvider,
    private event : Events) {
      this.currentLanguage = localStorage.getItem('lang') 
                                                        ? localStorage.getItem('lang') 
                                                        : 'En'
      this.languages = this.languageService.getLanguages();
  }

  setLanguage = () => {
    console.log(this.languageSelected)
    let defaultLanguage = this.translate.getDefaultLang();
    this.languageSelected = this.languageSelected  ? this.languageSelected : defaultLanguage;
    this.translate.setDefaultLang(this.languageSelected);
    this.translate.use(this.languageSelected);
    localStorage.setItem('lang',this.languageSelected);
    this.event.publish('langChanged');
  }
}
