import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';
import { Facebook } from '@ionic-native/facebook';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'user-facebook',
  templateUrl: 'user-facebook.html',
  providers: [Facebook]
})
export class UserFacebookComponent implements OnInit{

  isLoggedIn:boolean;
  userIDFB : string;
  body = new FormData();

  @Input() userFB : string;
  @Output() UserFBEvent = new EventEmitter<any>();

  constructor(private fb: Facebook,
              public translate: TranslateService) {
    
  }

  ngOnInit(){
    this.isLoggedIn = false;

    this.fb.getLoginStatus()
      .then(res => {
        console.log(res.status);
        if(res.status === "connect") {
          this.isLoggedIn = true;
        } else {
          this.isLoggedIn = false;
        }
      })
      .catch(e =>  alert('Error logging into Facebook'+ e));
  }

  login() {
    this.fb.login(['public_profile', 'email'])
      .then(res => {
        if(res.status === "connected") {
          this.isLoggedIn = true;
          this.userIDFB = res.authResponse.userID;
          this.getUserDetail(res.authResponse.userID);
        } else {
          this.isLoggedIn = false;
        }
      })
      .catch(e =>{
         console.log(e) 
         console.log(JSON.stringify(e))
      });
  }

  getUserDetail(userid) {
    this.fb.api("/"+userid+"/?fields=id,email,name,picture,gender",["public_profile"])
      .then(res => {
        this.UserFBEvent.emit(res);
      })
      .catch(e =>  console.log('Error logging into Facebook'+ e));
  }

  logout() {
    this.fb.logout()
      .then( res => this.isLoggedIn = false)
      .catch(e => alert('Error logout from Facebook'+ e));
  }
}
