import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { InAppBrowser, InAppBrowserOptions } from '@ionic-native/in-app-browser';

/**
 * Generated class for the PayTabsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-pay-tabs',
  templateUrl: 'pay-tabs.html',
})
export class PayTabsPage {
  options: InAppBrowserOptions = {
    location: 'yes',
    hidden: 'no',
    clearcache: 'yes',
    clearsessioncache: 'yes',
    zoom: 'yes',
    hardwareback: 'yes',
    mediaPlaybackRequiresUserAction: 'no',
    shouldPauseOnSuspend: 'no',
    closebuttoncaption: 'Close',
    disallowoverscroll: 'no',
    toolbar: 'yes',
    enableViewportScale: 'no',
    allowInlineMediaPlayback: 'no',
    presentationstyle: 'pagesheet',
    fullscreen: 'yes',
  };
  constructor(public navCtrl: NavController, 
              public navParams: NavParams,
              private inAppBrowser: InAppBrowser,
            ) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad PayTabsPage');
  }

}
