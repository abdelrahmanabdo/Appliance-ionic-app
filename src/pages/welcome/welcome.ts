import { NotificationProvider } from '../../providers/notification/notification';
import { FcmProvider } from '../../providers/fcm/fcm';
import { AuthProvider } from '../../providers/auth/auth';
import { LoginPage } from '../login/login';
import { Component } from '@angular/core';
import { IonicPage, NavController, Events } from 'ionic-angular';
import { MainPage } from '..';
import { TranslateService } from '@ngx-translate/core';

/**
 * The Welcome Page is a splash page that quickly describes the app,
 * and then directs the user to create an account or log in.
 * If you'd like to immediately put the user onto a login/signup page,
 * we recommend not using the Welcome page.
*/
@IonicPage()
@Component({
  selector: 'page-welcome',
  templateUrl: 'welcome.html',
  providers:[AuthProvider , FcmProvider , NotificationProvider]
})
export class WelcomePage {
  UsingFacebook;
  userfb;
  constructor(
    public navCtrl: NavController,
    public translate : TranslateService ,
    private _AuthProvider : AuthProvider ,
    private event : Events , 
    private fcm : FcmProvider , 
    private _notificationService : NotificationProvider , 
  ) 
  { 
      this.UsingFacebook =  this.translate.instant('facebook');
  }

  receiveUserFB = ($event) => {
    this.userfb = $event;
    console.log(this.userfb);
    console.log(this.userfb.email);
    this.userfb.firstName = this.userfb.name.split(' ')[0];
    this.userfb.lastName = this.userfb.name.split(' ')[1];
    this._AuthProvider.check_user_by_email(this.userfb.email).subscribe((res)=>{
      if(res.status == 404){
        delete this.userfb.name;
        console.log(this.userfb)
        this.navCtrl.push("LoginPage" ,{
          userFB : this.userfb,
          loginBy : "facebook"
        },{animate: false});
      }else {
        localStorage.setItem('LoginSession', 'true');
        localStorage.setItem('userid',res.id);
        localStorage.setItem('firstName',res.firstname);
        localStorage.setItem('lastName',res.lastname);
        localStorage.setItem('email',res.email);                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   
        localStorage.removeItem("compareList");
        this.event.publish('MenuChange');
        this.fcm.getToken().then((token)=>{
          console.log(token)
          this._notificationService.add_user_token(res.id,token).subscribe((res)=>{
            console.log(res)
          })                                                                              
      });
      this._AuthProvider.loginByCustomerId(res.id).subscribe( (res) => { 
        localStorage.setItem('Token',res);
      });
      this.navCtrl.setRoot(MainPage,{animate: false});    
      }
    }
  );


  }

  login   = () => this.navCtrl.push('LoginPage',{animate: false});
  

  signup  = () => this.navCtrl.push('SignupPage',{animate: false});
  

  skip    = () => this.navCtrl.push(MainPage,{animate: false});
}
