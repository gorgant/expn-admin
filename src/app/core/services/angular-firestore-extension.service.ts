// Currently not using this but keeping for potential future use, need to add providers to app.module

// import { Injectable, NgZone } from '@angular/core';
// import { AngularFirestore } from '@angular/fire/firestore';
// import { environment } from 'src/environments/environment';
// import { AngularFireAuth } from '@angular/fire/auth';


// // @Injectable({
// //   providedIn: 'root'
// // })

// // Courtesy of https://stackoverflow.com/a/51922426/6572208
// // also consider: https://github.com/angular/angularfire2/issues/1305#issuecomment-361884177
// @Injectable()
// export class AngularfirestoreAdminStoreService extends AngularFirestore {}

// export function AngularfirestoreAdminStoreFactory(platformId: {}, zone: NgZone) {
//   return new AngularFirestore(environment.admin, 'admin', false, null, platformId, zone, null);
// }

// export class AngularfirestorePublicStoreService extends AngularFirestore {}

// export function AngularfirestorePublicStoreFactory(platformId: {}, zone: NgZone) {
//   return new AngularFirestore(environment.public, 'public', false, null, platformId, zone, null);
// }


// export class AngularfirestorePublicAuthService extends AngularFireAuth {}

// export function AngularfirestorePublicAuthFactory(platformId: {}, zone: NgZone) {
//   return new AngularFireAuth(environment.public, 'public', platformId, zone);
// }
