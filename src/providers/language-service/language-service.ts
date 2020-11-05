import { ILanguageModel } from '../../models/ILanguageModel.model';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

/*
  Generated class for the LanguageServiceProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class LanguageServiceProvider {

  languages : Array<ILanguageModel> = new Array<ILanguageModel>();
  
     constructor() {
       this.languages.push(
         {name: "Eng_lang", code: "En"},
         {name: "Ar_lang", code: "Ar"}
       );
     }
  
     getLanguages(){
       return this.languages;
     }
}
