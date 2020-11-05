import { ProductsProvider } from './../providers/products/products';
import { LanguageInterceptorServiceProvider } from './../providers/language-interceptor-service/language-interceptor-service';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { ErrorHandler, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { Camera } from '@ionic-native/camera';
import { InAppBrowser } from '@ionic-native/in-app-browser';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { IonicStorageModule, Storage } from '@ionic/storage';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { IonicApp, IonicErrorHandler, IonicModule, NavController } from 'ionic-angular';
import { Deeplinks } from '@ionic-native/deeplinks';
import { MyApp } from './app.component';
import { PaytabsServiceProvider } from '../providers/paytabs-service/paytabs-service';
import { PayFortServiceProvider } from '../providers/pay-fort-service/pay-fort-service';
import { SearchProvider } from '../providers/search/search';
import { WishlistProvider } from '../providers/wishlist/wishlist';
import { ReviewsProvider } from '../providers/reviews/reviews';
import { Ionic2RatingModule } from 'ionic2-rating';
import { OrdersProvider } from '../providers/orders/orders';
import { LanguageComponentModule } from '../components/language/language.module';
import { UserProvider } from '../providers/user/user';
import { CartProvider } from '../providers/cart/cart';
import { AramexProvider } from '../providers/aramex/aramex';
import { FilterProvider } from '../providers/filter/filter';
import { ApiHandlerProvider } from '../providers/api-handler/api-handler';
import { LanguageServiceProvider } from '../providers/language-service/language-service';
import { MenuListComponentModule } from '../components/menu-list/menu-list.module';
import { NotificationProvider } from '../providers/notification/notification';
import { Firebase } from '@ionic-native/firebase';
import { AngularFireModule } from 'angularfire2';
import { AngularFirestoreModule } from 'angularfire2/firestore';
import { FcmProvider } from '../providers/fcm/fcm';
import { GeneralSettingsProvider } from '../providers/general-settings/general-settings';
import { TokenInterceptorServiceProvider } from '../providers/token-interceptor-service/token-interceptor-service';
import {  HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthProvider } from '../providers/auth/auth';
import { Keyboard } from '@ionic-native/keyboard';

// The translate loader needs to know where to load i18n files
// in Ionic's static asset pipeline.
export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}
  // Initialize Firebase
  var config = {
    apiKey: "AIzaSyDcBpIZ9wChtjHtn8s7rS-klvYun7_NdcY",
    authDomain: "app-liance-ec68a.firebaseapp.com",
    databaseURL: "https://app-liance-ec68a.firebaseio.com",
    projectId: "app-liance-ec68a",
    storageBucket: "app-liance-ec68a.appspot.com",
    messagingSenderId: "569258156056"
  };

@NgModule({
  declarations: [
    MyApp
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AngularFireModule.initializeApp(config), 
    AngularFirestoreModule,
    MenuListComponentModule,
    Ionic2RatingModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: (createTranslateLoader),
        deps: [HttpClient]
      }
    }),
    LanguageComponentModule,
    IonicModule.forRoot(MyApp),
    IonicStorageModule.forRoot(),
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS, 
      useClass: TokenInterceptorServiceProvider, 
      multi: true 
    },
    {
      provide: HTTP_INTERCEPTORS, 
      useClass: LanguageInterceptorServiceProvider, 
      multi: true 
    },
    Keyboard,
    Camera,
    SplashScreen,
    FcmProvider,
    StatusBar,
    InAppBrowser,
    { provide: ErrorHandler, useClass: IonicErrorHandler },
    PaytabsServiceProvider,
    PayFortServiceProvider,
    SearchProvider,
    WishlistProvider,
    WishlistProvider, 
    ReviewsProvider,
    OrdersProvider,
    UserProvider,
    CartProvider,
    AramexProvider,
    ProductsProvider,
    FilterProvider,
    Firebase,
    ApiHandlerProvider,
    LanguageServiceProvider,
    Deeplinks,
    NotificationProvider,
    GeneralSettingsProvider,
    AuthProvider,
    LanguageInterceptorServiceProvider,
  ]
})
export class AppModule { }
