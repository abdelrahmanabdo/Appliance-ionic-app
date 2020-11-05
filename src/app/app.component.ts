import { UserProvider } from '../providers/user/user';
import { Component, ViewChild } from '@angular/core';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { TranslateService } from '@ngx-translate/core';
import { Config, Nav, Platform, Events, Menu, AlertController } from 'ionic-angular';
import { FirstRunPage } from '../pages';
import { FcmProvider } from '../providers/fcm/fcm';
import { Deeplinks } from '@ionic-native/deeplinks';
import { NavController } from 'ionic-angular/navigation/nav-controller';

@Component({
  templateUrl:'app.html',
})
export class MyApp {
  @ViewChild(Menu) menu: Menu;

  rootPage  = localStorage.getItem("LoginSession") === "true" ? "TabsPage" : FirstRunPage;

  @ViewChild(Nav) nav: Nav;

  constructor(
    private translate: TranslateService,
    platform: Platform,
    private config: Config,
    private statusBar: StatusBar,
    private splashScreen: SplashScreen,
    private _userService : UserProvider,
    private events: Events,
    private fcm : FcmProvider,
    private deeplinks : Deeplinks,

  ) {
    localStorage.getItem('lang') ?
                                 localStorage.setItem('lang',localStorage.getItem('lang'))
                                 :localStorage.setItem('lang','En')
    platform.ready().then(() => { 
      this.statusBar.styleLightContent();
      this.statusBar.backgroundColorByHexString("#312d45");
      this.splashScreen.hide();
    });

  
  }

}
