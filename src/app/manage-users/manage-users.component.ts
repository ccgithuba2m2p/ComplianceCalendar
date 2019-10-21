import { Component, Inject, HostListener } from '@angular/core';
import * as firebase from "firebase/app";
import "firebase/auth";
import "firebase/database";
import { SESSION_STORAGE, WebStorageService } from 'angular-webstorage-service';
import { FormGroup, Validators, FormControl } from '@angular/forms';

@Component({
  selector: 'manage-users',
  templateUrl: './manage-users.component.html',
  styleUrls: ['./manage-users.component.scss']
})
export class ManageUsersComponent {
  browseUsers = true;
  addUser = false;
  searchText: string = '';
  userList = [];
  addUserForm: FormGroup;
  validForm = false;
  tempUserList = [];
  resultUserList = [];

  @HostListener('input') oninput() {
    this.searchItems();
    if(this.addUserForm.valid){
      this.validForm = true;
    }else{
      this.validForm = false;
    }
  }
  
  constructor(@Inject(SESSION_STORAGE) private storage: WebStorageService){}

  ngOnInit(){
    let adminId = this.storage.get('user').uid;
    firebase.database().ref('/User').on('value', users =>{
      this.userList = [];
      users.forEach(u => {
        let user = u.val();
        if(user.admin === adminId){
          let a = {
            id : u.key,
            name: user.name,
            type: user.type,
            email: user.email
          }
          this.userList.push(a);
        }
      });
      this.tempUserList = this.userList;
    });

    this.addUserForm = new FormGroup({
      addUserName : new FormControl('', Validators.required),
      addUserEmail : new FormControl('', [Validators.required, Validators.email]),
      addUserRole : new FormControl('', Validators.required),
      addUserDepartment : new FormControl('', Validators.required)
    });
  }

  get addUserName(){
    return this.addUserForm.get('addUserName');
  }

  get addUserEmail(){
    return this.addUserForm.get('addUserEmail');
  }

  get addUserRole(){
    return this.addUserForm.get('addUserRole');
  }

  get addUserDepartment(){
    return this.addUserForm.get('addUserDepartment');
  }

  activateBrowseUsers(){
    this.browseUsers = true;
    this.addUser = false;
  }

  activateAddUser(){
    this.browseUsers = false;
    this.addUser = true;
  }

  searchItems() {
    this.userList = this.tempUserList;
    if(!this.searchText || this.searchText === ''){
      
    }    
    if(this.searchText){
      this.resultUserList = [];
      this.userList.forEach(user => {
        if(user.name.toLowerCase().includes(this.searchText.toLowerCase())){
          this.resultUserList.push(user);
        }
      });
      this.userList = this.resultUserList;
    }
  }

  addNewUser(){

  }
}
