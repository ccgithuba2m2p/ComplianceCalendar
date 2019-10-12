// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.
import * as firebase from "firebase/app";
export const environment = {
  production: false,
  firebaseConfig : {
    apiKey: "AIzaSyA40MlmoufXWMgZ4S6lbNKqhISbR82xaJI",
    authDomain: "compliance-management-dev.firebaseapp.com",
    databaseURL: "https://compliance-management-dev.firebaseio.com",
    projectId: "compliance-management-dev",
    storageBucket: "",
    messagingSenderId: "86216617406",
    appId: "1:86216617406:web:821801d5877d2460da1def",
    measurementId: "G-KNF2TLM65B"
  }
};
firebase.initializeApp(environment.firebaseConfig);

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
