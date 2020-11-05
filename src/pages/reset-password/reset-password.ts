import { LoginPage } from '../login/login';
import { UserProvider } from '../../providers/user/user';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController } from 'ionic-angular';
import { Validators, FormBuilder, FormGroup, FormControl } from '@angular/forms';

/**
 * Generated class for the ResetPasswordPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-reset-password',
  templateUrl: 'reset-password.html',
  providers: [UserProvider]
})
export class ResetPasswordPage {
  password = {
    email : null ,
    newPassword: null,
    confirmNewPassword: null
  }
  resetPasswordToken ;
  restPasswordForm : FormGroup;
  dataAvilable =  true;
  constructor(public navCtrl: NavController,
              public navParams: NavParams ,
              public toast : ToastController,
              public formBuilder: FormBuilder,
              private _userService : UserProvider) {
                this.resetPasswordToken = this.navParams.get('token');
                this.restPasswordForm = this.formBuilder.group({
                  email: new FormControl('', Validators.compose([
                    Validators.required,
                    Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')

                  ])),
                  newPassword: new FormControl('', Validators.compose([
                    Validators.maxLength(30),
                    Validators.minLength(8),
                    Validators.required,
                    Validators.pattern('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])[a-zA-Z0-9_-]+$')                 
                ])),
                  confirmNewPassword: new FormControl('', Validators.compose([
                    Validators.maxLength(30),
                    Validators.minLength(8),
                    Validators.required,
                    Validators.pattern('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])[a-zA-Z0-9_-]+$')    
                  ])),
                
                },{validator: this.matchingPasswords('newPassword', 'confirmNewPassword')});
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
  
  validation_messages = {
    'email': [
      { type: 'required', message: 'Email is required.'},
    ],
    'newPassword': [
      { type: 'required', message: 'Password is required.' },
      { type: 'minlength', message: 'Password must be at least 8 characters long.'},
      { type: 'pattern', message: 'Your password must contain at least one uppercase, one lowercase, and one number.' }    ],
    'confirmNewPassword': [
      { type: 'required', message: 'Confirm password is required.'},
    ],
    'mismatch_password': { message : "Passwords are differents" , status : false} 
  
  };

  ResetPassword = () => {
      if(this.password.newPassword && this.password.confirmNewPassword !== null) {
        if(this.password.newPassword !== this.password.confirmNewPassword){
          this.validation_messages.mismatch_password.status = true ;
        }else {
          this.dataAvilable = false;
          this._userService.ResetUserPassword(this.password.email,this.password.newPassword , this.resetPasswordToken).subscribe((resetPasswordResult)=>{
            if(resetPasswordResult) {
              let toast = this.toast.create({
                  message : 'Password updated successfully',
                  duration : 3000
              });
              toast.present();
              this.dataAvilable = true;
              this.navCtrl.push("LoginPage",{animate: false});
            }
          },(error : any) => {
            if(error === "tokenExpired"){
              let toast = this.toast.create({
                message : 'Reset password token has exipred ',
                duration : 3000
            });
            toast.present();
  
            }else {
              let toast = this.toast.create({
                message : 'Insert correct email',
                duration : 3000
            });
            toast.present();
            }
            this.dataAvilable = true;
  
          });
        }

    }else {
      let toast = this.toast.create({
        message : 'Please insert new password',
        duration : 3000
    });
    toast.present();
    }
  }
 
  back = () => {
    this.navCtrl.setRoot('WelcomePage');
  }
}
