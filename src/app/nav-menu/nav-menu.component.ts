import { Component, Inject } from '@angular/core';
import { Router } from '@angular/router';
import * as firebase from "firebase/app";
import "firebase/auth";
import { SESSION_STORAGE, WebStorageService } from 'angular-webstorage-service';

@Component({
  selector: 'app-nav-menu',
  templateUrl: './nav-menu.component.html',
  styleUrls: ['./nav-menu.component.scss']
})
export class NavMenuComponent {
  title = 'CCalender';

  constructor(private router:Router, @Inject(SESSION_STORAGE) private storage: WebStorageService) {
  }

  logout(){
    firebase.auth().signOut().then(() => {
      this.storage.remove('user');
      this.router.navigate(['/']);
    }).catch(function(error) {
      // An error happened.
    });
  }
}
