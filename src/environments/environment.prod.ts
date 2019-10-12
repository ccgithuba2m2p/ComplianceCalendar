import * as firebase from "firebase/app";
export const environment = {
  production: true,
  firebaseConfig : {
    apiKey: "AIzaSyBSDL2i9I6t8OO5C_uU5hQa-nrYiXeJjWc",
    authDomain: "compliance-management-d4447.firebaseapp.com",
    databaseURL: "https://compliance-management-d4447.firebaseio.com",
    projectId: "compliance-management-d4447",
    storageBucket: "",
    messagingSenderId: "954297785573",
    appId: "1:954297785573:web:32376a20419665ed75480c"
  }
};
firebase.initializeApp(environment.firebaseConfig);
