import { Observable } from 'rxjs/Observable';
import { UserProvider } from '../../providers/user/user';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Toast, ToastController } from 'ionic-angular';
import { AuthProvider } from '../../providers/auth/auth';
import { Validators, FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { PasswordValidator } from '../../validators/password.validator';
import { ChangeDetectionStrategy } from '@angular/compiler/src/core';
import { TranslateService } from '@ngx-translate/core';
import { MyAccountPage } from '../my-account/my-account';

/**
 * Generated class for the AccountInfoPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-account-info',
  templateUrl: 'account-info.html',
  providers:[AuthProvider, UserProvider]
})
export class AccountInfoPage {
  userData = {
    firstname : null,
    lastname : null ,
    email    : null ,
    password : null ,
  };

  updateUserData : FormGroup;
  dataAvilable  = false;
  enableButton = false ;
  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private _authService : AuthProvider,
              private _userService : UserProvider,
              public formBuilder: FormBuilder,
              public toast  : ToastController ,
              public translate : TranslateService
            ) {
                this._authService.getLoggedInUserData(localStorage.getItem('Token')).subscribe((res)=> {
                    console.log(res)
                    this.userData.firstname = res.firstname;
                    this.userData.lastname = res.lastname;
                    this.userData.email = res.email;

                    this.dataAvilable = true ;
                });
  }


  ionViewDidLoad() {
    console.log('ionViewDidLoad AccountInfoPage');
  }


  
  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.

    this.updateUserData = this.formBuilder.group({
      firstname: new FormControl('', Validators.compose([
        Validators.required,
      ])),
      lastname: new FormControl('', Validators.compose([
        Validators.required,
      ])),
      email: new FormControl('', Validators.compose([
        Validators.required,
        Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')
        
      ])),
      oldPassword: new FormControl('', Validators.compose([
        Validators.maxLength(30),
        Validators.minLength(8),
        Validators.required,
        Validators.pattern('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])[a-zA-Z0-9_-]+$')
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
    'firstname': [
      { type: 'required', message: 'First name is required.'},
    ],
    'lastname': [
      { type: 'required', message: 'Last name is required.'},
    ],
    'email': [
      { type: 'required', message: 'Email is required.'},
    ],
    'oldPassword': [
      { type: 'required', message: 'Password is required.' },
      { type: 'minlength', message: 'Password must be at least 8 characters long.'},
      { type: 'pattern', message: 'Your password must contain at least one uppercase, one lowercase, and one number.' }    ],
    'newPassword': [
      { type: 'required', message: 'Password is required.' },
      { type: 'minlength', message: 'Password must be at least 8 characters long.'},
      { type: 'pattern', message: 'Your password must contain at least one uppercase, one lowercase, and one number.' }    ],
    'confirmNewPassword': [
      { type: 'required', message: 'Confirm password is required.'},
    ],
    'matching_passwords': [
      { type: 'areEqual', message: this.translate.currentLang === 'en' ? 'Password mismatch':'كلمة السر غير متطابقة' }
    ],
  
  };

  update = (values) =>{
    console.log(this.userData)
    this.dataAvilable = false ;
    let dataToUpdate = {
      firstName : this.userData.firstname === localStorage.getItem('firstName') 
                                                         ? false 
                                                         : true, 
      lastName : this.userData.lastname === localStorage.getItem('lastName') 
                                                       ? false 
                                                       : true, 
      email : this.userData.email === localStorage.getItem('email') 
                                                 ? false 
                                                 : true, 
      password : this.userData.password !== null
                                        ? true 
                                        : false  
    };
          let dataToUpdateArray = Object.keys(dataToUpdate).map(key => ({key: key , value : dataToUpdate[key]}));
          if( dataToUpdateArray[3].value && !dataToUpdateArray[2].value && !dataToUpdateArray[1].value && !dataToUpdateArray[0].value){
              this.updatePassword(values.oldPassword , values.newPassword);

          }else if ((dataToUpdateArray[0].value || dataToUpdateArray[1].value || dataToUpdateArray[2].value )&& !dataToUpdateArray[3].value) {
              this.updateCustomerData(this.userData);

          }else {
             this.updatePassword(values.oldPassword , values.newPassword , false ).then((status)=>{
              if(status){
                this.userData.password = values.newPassword;
                this.updateCustomerData(this.userData);
              }

             });
          }
  }

  updatePassword = (old_password , new_password , showToast = true )  => {
  return new Promise((resolve, reject) =>{
    this._userService.change_user_password(old_password,new_password).subscribe((changedPassword)=>{
      console.log(changedPassword)
      if(changedPassword === "wrongPassword") {
        let toasting = this.toast.create({
          message : "Wrong old Password",
          duration : 3000,
          position : 'top', 
          cssClass : 'toast'
        });
        toasting.present();
        this.dataAvilable = true ;
        resolve(false) ;
      }else {
        let toasting = this.toast.create({
          message : "Password Updated successfully",
          duration : 3000,
          position : 'top', 
          cssClass : 'toast'
        });
        showToast? toasting.present() : '';
        this.dataAvilable = true ;
        resolve(true) ;
      }
      this.navCtrl.popTo("MyAccountPage",{animate: false});

    },   
    error => this.dataAvilable = true);
  });
    
  }


  updateCustomerData = (data , InConditionOfChangingPassword = true) => {
     return  this._userService.update_specific_user_info(data).subscribe((changedDate: any)=>{
      if(changedDate) {
        localStorage.setItem('firstName',changedDate.firstname);
        localStorage.setItem('lastName',changedDate.lastname);
        localStorage.setItem('email',changedDate.email); 
          let toasting = this.toast.create({
            message : "Data Updated successfully",
            duration : 3000,
            position : 'top', 
            cssClass : 'toast'
          });
          InConditionOfChangingPassword 
                                      ?  toasting.present() 
                                      : '';
          this.dataAvilable = true ;
        }
        this.navCtrl.popTo("MyAccountPage",{animate: false});
    },   
    error => this.dataAvilable = true);
  }
  
  enableSaveButton = () => {
    if((this.userData.firstname === localStorage.getItem('firstName'))&&
       (this.userData.lastname === localStorage.getItem('lastName')) &&
       (this.userData.email === localStorage.getItem('email'))
     ){
       return this.enableButton = false ;
     }else {
      return this.enableButton = true;
     }

  }

  back = ()=> {
    this.navCtrl.pop({animate:false});
  }
}
