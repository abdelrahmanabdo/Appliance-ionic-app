import { UserProvider } from '../../providers/user/user';
import { Component, ViewChild, OnInit, NgZone, NgModule } from '@angular/core';
import { TranslateService, LangChangeEvent } from '@ngx-translate/core';
import { Events, Nav, Platform, AlertController, Menu, MenuController, Config } from 'ionic-angular';
// import { FcmProvider } from '../../providers/fcm/fcm';
// import { LoginService } from '../../providers/login.service/login.service';
import { Deeplinks } from '@ionic-native/deeplinks';
// import { Network } from '@ionic-native/network';
import { AuthProvider } from '../../providers/auth/auth';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { FirstRunPage } from '../../pages';
// import { ApiService } from '../../providers/api.service/api.service';
@Component({
  selector: 'menu-list',
  templateUrl: 'menu-list.html',
  providers:[MenuController,AuthProvider , AlertController]
})

export class MenuListComponent {
  rootPage =
    localStorage.getItem("LoginSession") === "true" ? "TabsPage" : FirstRunPage;

  @ViewChild(Nav) nav: Nav;

  pages: Array<{title: string, component: string}>;
  exitAppMessage : string ;

  constructor(
    private translate: TranslateService,
    private splashScreen: SplashScreen,
    private _userService : UserProvider,
    private events: Events,
    private platform : Platform,
    private menu : MenuController,
    private deeplinks: Deeplinks,
    public alert : AlertController
  ) {
    this.translate.setDefaultLang(localStorage.getItem('lang') === null ? 'En' : localStorage.getItem('lang'));
    this.translate.use(localStorage.getItem('lang') === null ? 'En' : localStorage.getItem('lang'));
    this.events.subscribe("logout", ()=>{
    this.pages.splice(2, 1);
    })

    this.pages = [
      { title: this.translate.instant('menu_home'), component: 'TabsPage' },
      { title: this.translate.instant('menu_categories'), component: 'CategoriesPage' },
      { title: this.translate.instant('menu_settings'), component: 'CategoriesPage' },
      { title: this.translate.instant('menu_terms'), component: 'TermsAndConditionsPage' },
      { title: this.translate.instant('menu_support'), component: 'SupportPage' },
      { title: this.translate.instant('menu_login'), component: 'LoginPage'}
    ]; 

    platform.ready().then(() => {
      var defaultOptions = {
          root: true,
            };

      this.deeplinks.routeWithNavController(this.nav , {
        '/customer/account/createPassword/': 'ResetPasswordPage',
        '/index.php/:productName': 'ProductSinglePage' ,
        '/customer/account/confirm/:' : 'LoginPage'
      } , defaultOptions).subscribe((match) => {
        this.nav.setRoot(match.$route , match.$args)
      }, (nomatch) => {
        console.log(nomatch);
      });
    });


    platform.registerBackButtonAction(() => {
      if(this.nav.canGoBack()){
        this.nav.pop();
      }else{
        this.translate.get('exitApp').subscribe(t=> this.exitAppMessage = t)
        let exitAppAlert = this.alert.create({
          message:  this.exitAppMessage,
          buttons: [
          {
            text : 'Cancel' ,
            role : 'cancel'
          },
          {
            text : 'Exit',
            handler : () => {
               platform.exitApp();
            }
          }]
          
        });
        exitAppAlert.present();
      }
      
    },1);
    this.events.subscribe("logout", () => {
      //  this.pages.splice(2, 1);
       this.pages.push({ title: this.translate.instant('menu_login'), component: 'LoginPage'})
    });

    if(localStorage.getItem("LoginSession")){
      this.pages.splice(2, 0, {
        title: "My Account",  
        component: "MyAccountPage"
      });
      this.pages.splice(-1,1);    
    }

    this.events.subscribe('langChanged', ()=> {

       this.menu.close();
       this.nav.setRoot('TabsPage')
     });
    this.events.subscribe("MenuChange", () => {
      this.pages.splice(2, 0, {
        title: "My Account",  
        component: "MyAccountPage"
      });
      this.pages.splice(-1,1);
    });

    this.translate.onLangChange.subscribe((event: LangChangeEvent)=> {
      if(this.translate.currentLang === 'En'){
        this.platform.setDir('ltr', true);
        this.pages = [
          { title: this.translate.instant('menu_home'), component: 'TabsPage' },
          { title: this.translate.instant('menu_categories'), component: 'CategoriesPage' },
          { title: this.translate.instant('menu_settings'), component: 'CategoriesPage' },
          { title: this.translate.instant('menu_terms'), component: 'TermsAndConditionsPage' },
          { title: this.translate.instant('menu_support'), component: 'SupportPage' },
          { title: this.translate.instant('menu_login'), component: 'LoginPage'}
        ]; 
        if(localStorage.getItem("LoginSession") === 'true'){
          this.pages.pop();
          this.pages.splice(2 , 0 , { title: this.translate.instant('menu_my_account'), component: 'MyAccountPage'});
        }
      }else{  
        this.platform.setDir('rtl', true);
        this.pages = [
          { title: this.translate.instant('menu_home'), component: 'TabsPage' },
          { title: this.translate.instant('menu_categories'), component: 'CategoriesPage' },
          { title: this.translate.instant('menu_settings'), component: 'CategoriesPage' },
          { title: this.translate.instant('menu_terms'), component: 'TermsAndConditionsPage' },
          { title: this.translate.instant('menu_support'), component: 'SupportPage' },
          { title: this.translate.instant('menu_login'), component: 'LoginPage'}
        ]; 
        if(localStorage.getItem("LoginSession") === 'true'){
          this.pages.pop();
          this.pages.splice(2 , 0 , { title:
             this.translate.instant('menu_my_account'), component: 'MyAccountPage'});
        }
      }
    }); 
  }


  openPage(page) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario  
      this.nav.setRoot(page.component);
    
  }

}
