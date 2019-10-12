import { Component, HostListener, Inject } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import * as firebase from "firebase/app";
import "firebase/auth";
import "firebase/database";
import { ToastrService } from 'ngx-toastr';
import { Router, ActivatedRoute } from '@angular/router';
import { SESSION_STORAGE, WebStorageService } from 'angular-webstorage-service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  loginForm: FormGroup;

  disabledLoginButton = true;
  returnUrl = '';

  @HostListener('input') oninput() {

    if(this.loginForm.valid){
      this.disabledLoginButton = false;
    }else{
      this.disabledLoginButton = true;
    }
  }
  
  constructor(public fb: FormBuilder, private toast: ToastrService, private router:Router,private route: ActivatedRoute,@Inject(SESSION_STORAGE) private storage: WebStorageService) {
    this.loginForm = fb.group({
      emailFormEx: [null, [Validators.required, Validators.email]],
      passwordFormEx: [null, Validators.required],
    });
  }

  ngOnInit() {
    firebase.auth().signOut();

    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/dashboard';
  }

  get emailFormEx() { return this.loginForm.get('emailFormEx'); }
  get passwordFormEx() { return this.loginForm.get('passwordFormEx'); }

  login(){
    let email = this.loginForm.get('emailFormEx').value;
    let password = this.loginForm.get('passwordFormEx').value;
    let toastr = this.toast;
    let router = this.router;
    firebase.auth().signInWithEmailAndPassword(email, password).catch(function(error) {
      // Handle Errors here.
      var errorCode = error.code;
      var errorMessage = error.message;
      if (errorCode === 'auth/wrong-password') {
        toastr.error("You have entered wrong password!!!");
      } else if(errorCode === 'auth/user-not-found'){
        toastr.error("User not found. Please contact your administrator");
      }
    }).finally(() => {
      firebase.auth().onAuthStateChanged(user => {
        if (user) {
          firebase.database().ref('/User').child(user.uid).child('type').once('value', type => {
            this.storage.set('userType', type);
            this.storage.set('user', user);
            this.router.navigateByUrl(this.returnUrl);
          });
        }
      });
    });
  }
}
