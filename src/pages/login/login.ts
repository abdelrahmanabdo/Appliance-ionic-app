import { CartProvider } from './../../providers/cart/cart';
import { CurrencyComponent } from './../../components/currency/currency';
import { UserProvider } from '../../providers/user/user';
import { NotificationProvider } from '../../providers/notification/notification';
import { FcmProvider } from '../../providers/fcm/fcm';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, ToastController, LoadingController, MenuController } from 'ionic-angular';
import { AuthProvider } from '../../providers/auth/auth';
import { Events } from 'ionic-angular';
import { Validators, FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { PasswordValidator } from '../../validators/password.validator';
import { MainPage } from '..';
import * as $ from "jquery";
import { HttpErrorResponse } from '@angular/common/http';
import { TranslateService } from '@ngx-translate/core';
@IonicPage()
@Component({
	selector: 'page-login',
	templateUrl: 'login.html',
	providers: [AuthProvider,FcmProvider,UserProvider,CurrencyComponent,CartProvider]
})
export class LoginPage {
  showSignIn : boolean ;
  showSignUp : boolean ;
  login_form: FormGroup;
  register_form : FormGroup;

  // Variables 
  user = {'email':'',
          'password':''    
         }
  
 // Variables 
 userData = {'firstName':'',
 'lastName' :'',
 'email'    :'',
 'password' :'',
 'confirmPassword':''   
};
userfb;
UsingFacebook;
regexUpper   = /^(?=.*?[A-Z]).{8,}$/;
regexlower   = /^(?=.*?[a-z]).{8,}$/;
regexnumbers = /^(?=.*?[0-9]).{8,}$/;
loginBy ;
facebookData ;
dataAvilable ;
messageText;
showConfirmationMessage = false ;
constructor(  
    public  navCtrl     : NavController     ,
    public  navParams   : NavParams         , 
    public  loginService    : AuthProvider     ,
    public  event       : Events            ,
    public  alert     : AlertController,
    public  loading     : LoadingController, 
    public  menu         : MenuController,
    public translate : TranslateService,
    private events     : Events ,
    private fcm : FcmProvider,
    public  formBuilder: FormBuilder,
    public  toast      : ToastController,
    private _notificationService : NotificationProvider,
    private _AuthProvider : AuthProvider,
    private _userService : UserProvider,
    public currency : CurrencyComponent,
    private _cartService  : CartProvider){
    this.UsingFacebook =  this.translate.instant('facebook');
    this.dataAvilable = true;
    this.showSignIn = true;
    if (this.navParams.get('key')){
      this.showConfirmationMessage = true ;
    }

  }

  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this.loginBy = this.navParams.get("loginBy");
    this.facebookData = this.navParams.get("userFB");
    if(this.loginBy === "facebook") {
      this.SingUp_page();
    }

    this.login_form = this.formBuilder.group({
      email: new FormControl('', Validators.compose([
        Validators.required,
        Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')
      ])),
      password: new FormControl('', Validators.compose([
        Validators.maxLength(191),
        Validators.minLength(8),  
        Validators.required,
      Validators.pattern('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])[a-zA-Z0-9_-]+$')      ])),

    });
    this.register_form = this.formBuilder.group({
      firstName : new FormControl('', Validators.compose([
          Validators.required
      ])),
      lastName : new FormControl('', Validators.compose([
        Validators.required
    ])),
      email: new FormControl('', Validators.compose([
        Validators.required,
        Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')
      ])),
      password: new FormControl('', Validators.compose([
        Validators.maxLength(191),
        Validators.minLength(8),
        Validators.required,
        Validators.pattern('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])[a-zA-Z0-9_-]+$')      ])),
      confirm_password: new FormControl('', Validators.compose([
        Validators.maxLength(191),
        Validators.minLength(8),
         Validators.required,
         Validators.pattern('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])[a-zA-Z0-9_-]+$')     
         ])),
     },{validator: this.matchingPasswords('password', 'confirm_password')});


  }


  matchingPasswords(passwordKey: string, confirmPasswordKey: string) {
    return (group: FormGroup): {[key: string]: any} => {
      let password = group.controls[passwordKey];
      let confirmPassword = group.controls[confirmPasswordKey];
      if (password.value !== confirmPassword.value) {
        return {
          mismatchedPasswords: true
        };
      }
    }
  }
  
  login_validation_messages = {
    'email': [
      { type: 'required', message: 'Email is required.'},
      { type: 'pattern', message: 'Enter a valid email.' }
    ],
    'password': [
      { type: 'required', message: 'Password is required.' },
      { type: 'minlength', message:  'Password must be at least 8 characters long.' },
      { type: 'pattern', message:  'Your password must contain at least one uppercase, one lowercase, and one number.'}
    ],
  };

  register_validation_messages = {
    'firstName' : [
      { type: 'required', message: 'First name is required.'},
    ],
    'lastName': [
      { type: 'required', message: 'Last name is required.'},      
    ],'email': [
      { type: 'required', message: 'Email is required.'},
      { type: 'pattern', message: 'Enter a valid email.' }

    ],
    'password': [
      { type: 'required', message: 'Password is required.' },
      { type: 'minlength', message: 'Password must be at least 8 characters long.'},
      { type: 'pattern', message: 'Your password must contain at least one uppercase, one lowercase, and one number.' }
    ],
    'confirm_password': [
      { type: 'required', message: 'Confirm password is required.' },
      { type: 'minlength', message: 'Password must be at least 8 characters long.'},
      { type: 'pattern', message: 'Your password must contain at least one uppercase, one lowercase, and one number.' },
      { type: 'mismatchedPasswords', message: 'mismatch.' },

    ],
  };

      SignIn_page = () => {
      $('.sign-up').removeClass('active');
      $('.sign-in').addClass('active');      
      this.showSignIn = true ;
      this.showSignUp = false ;
      console.log(this.showSignIn);
    }
    SingUp_page = () => {
      $('.sign-in').removeClass('active');
      $('.sign-up').addClass('active');
      this.showSignIn = false ;
      this.showSignUp = true ;
      console.log(this.showSignUp)
    }

    /**
     * Check if user authenticated or not
     * @param Object values
     *  
     */
    login = (values) => {
      this.user.email = values.email ;
      this.user.password = values.password;
      this.dataAvilable = false;
      this.loginService.loginAPI(this.user).subscribe((res) => { 
        if(res) {
            this.loginService.getLoggedInUserData(res).subscribe((data) =>{
              localStorage.setItem('Token',res.toString());
              localStorage.setItem('LoginSession', 'true');
              localStorage.setItem('userid',data.id);
              localStorage.setItem('firstName',data.firstname);
              localStorage.setItem('lastName',data.lastname);
              localStorage.setItem('email',data.email);    
              setTimeout(() => {
                if(localStorage.getItem('cartToken')){
                  localStorage.removeItem('cartCount');
                  this.mergeGuestAndCustomerCart()
                }else{
                  this.event.publish('cartCount');
                  this.event.publish('wishlistCount');
                }
              }, 200);  
              this.events.publish('MenuChange');                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             
              this.fcm.getToken().then((token)=>{
                console.log(token)
                this._notificationService.add_user_token(data.id,token)
                                         .subscribe((res)=>{
                                              console.log(res)
                                          });                                                
              });   
              this.currency.getCurrencyAndRate()
              this.dataAvilable = true ;
              this.navCtrl.setRoot(MainPage);  

            });
          }
       } , (error) => {
          if(error.status == 401) {
              let toast = this.toast.create({
                message : "Insert valid email and password Or the account is not enabled yet ",
                duration : 4000,
                position : 'top', 
                cssClass : 'toast'
              });
              this.dataAvilable = true;
              toast.present();
          }else if (error.status == 400) {
            let toast = this.toast.create({
              message : "Please enter valid username and password ",
              duration : 3000 , 
              position : 'top', 
              cssClass : 'toast'
            });
            this.dataAvilable = true;
            toast.present();
          }
       });
    }




    create_account(values) {
      this.userData.firstName = values.firstName;
      this.userData.lastName  = values.lastName ;
      this.userData.email     = values.email;
      this.userData.password  = values.password;
      this.userData.confirmPassword = values.confirm_password;

      this.dataAvilable = false ;
      this.loginService.create_account(this.userData).subscribe((result)=>{
       console.log(result)
       if(result.status == 1){
        this.dataAvilable = true;
        this.translate.get('createAccountSuccessfuly').subscribe((message)=>{
          this.messageText = message;
        });
        this.toast.create({message : this.messageText  , 'duration':3000}).present();


         this.SignIn_page();
       }else {
         this.toast.create({message : 'There is an error'}).present();
       }
      } , (error) => {
         if (error.status == 400) {
          if(error.error.message == "A customer with the same email already exists in an associated website." ){
            let toast = this.toast.create({
              message : "The E-mail is already exist" ,
              duration : 3000,
              position : 'top', 
              cssClass : 'toast'
            });
            this.dataAvilable = true;
            toast.present();
           }
        }
     });
  }

  ResetPassword = () => {
   let ResetPasswordEmail  = this.alert.create({
      title: 'Reset password',
      message: 'Please enter your email address below to receive a password reset link.',
      inputs:[
        {
          name: 'email',
          placeholder: 'E-mail'
        },
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
        },
        {
          text: 'Send',
          handler: data => {
            this.dataAvilable = false ;

            this._userService.SendReseetPasswordMail(data.email).subscribe((resetPasswordToken : any) => {
              if(resetPasswordToken !== false) {
                let toast = this.toast.create({
                  message : 'E-mail sent successfully',
                  duration : 3000
                });
                toast.present();
              }else {
                let toast = this.toast.create({
                  message : 'Error while sending E-mail',
                  duration : 3000
                });
                toast.present();
              }
              this.dataAvilable = true ;
            } , ( (error : any) => {
              if(error === 'wrongEmail'){
                let toast = this.toast.create({
                  message : 'This email does not exist',
                  duration : 3000
                });
                toast.present();
                this.dataAvilable = true ;
              }
            }) );
          }
        }
      ]      

    });
    ResetPasswordEmail.present();
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
      this.navCtrl.setRoot(MainPage);    
      }
    }
  );
  }

  /**
   * Merge cart of the user as a guest and authenticated user
   * @param guestCartToken string 
   * @param customerId number
   */ 
  mergeGuestAndCustomerCart = () => {
    this._cartService.mergeGustWithCustomerCart().then((res)=>{
      if(res){
        this.event.publish('cartCount');      
      }
    })
    
  }




}
