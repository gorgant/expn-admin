import * as admin from 'firebase-admin';

export const adminApp = admin.initializeApp();

// Requires adim service account to be added to public IAM
export const publicApp = admin.initializeApp({
  databaseURL: `https://explearning-76d93.firebaseio.com`,
}, 'public');