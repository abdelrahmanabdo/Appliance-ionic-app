import { Component } from '@angular/core';
import { GeneralSettingsProvider } from '../../providers/general-settings/general-settings';

/**
 * Generated class for the CurrencyComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'currency',
  templateUrl: 'currency.html'
})
export class CurrencyComponent {
  selectedCurrency : any;
  currencies : any ;
  defaultCurrency : string ;
  constructor(private generalSettingsService : GeneralSettingsProvider) {
                     this.getCurrencyAndRate();
                                
  }

  getCurrencyAndRate  = () => {
    if(localStorage.getItem('LoginSession')){
      this.generalSettingsService.getUserCurrentCurrency()
                                  .subscribe((current)=>{
                                    this.defaultCurrency = current.currency;
                                    localStorage.setItem('currencyRate',current.rate)
                                    localStorage.setItem('currency',this.defaultCurrency);
                                    this.generalSettingsService.getAvailableCurrencies()
                                                              .subscribe((curr)=>{
                                                                    this.currencies  = curr.exchange_rates;
                                    });
      });
    }else {
      this.generalSettingsService.getAvailableCurrencies()
                                 .subscribe((curr)=>{
                                   console.log(curr)
                                    this.currencies  = curr.exchange_rates;
                                    this.defaultCurrency = curr.base_currency_code;
                                    curr.exchange_rates.forEach(element => {
                                        if(element.currency_to === curr.base_currency_code){
                                              localStorage.setItem('currencyRate',element.rate)
                                        }
                                    });
                                    localStorage.setItem('currency',curr.base_currency_code);
                                 });
    }
  }
  setCurrency = () =>{
      localStorage.setItem('currency',this.selectedCurrency.currency_to)
      localStorage.setItem('currencyRate',this.selectedCurrency.rate)
  }

}
